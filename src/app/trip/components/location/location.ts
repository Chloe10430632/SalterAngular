import { Component, OnInit, inject, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TripService } from '../../services/trip';
import { LocationSearchService } from '../../services/location-search';
import { TripLocation, TripLocationSearch } from '../../interfaces/trip';
import { GoogleMapsModule } from '@angular/google-maps';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-location',
  imports: [FormsModule, GoogleMapsModule, DragDropModule, NgClass],
  templateUrl: './location.html',
  styleUrl: './location.css'
})
export class Location implements OnInit, AfterViewInit {

  private tripService = inject(TripService);
  private locationSearchService = inject(LocationSearchService);
  private route = inject(ActivatedRoute);
  private searchSubject = new Subject<string>();
  tripId = 0;
  locations: TripLocation[] = [];
  selectedLocation: TripLocation | null = null;
  isLoading = false;
  isEditing = false;
  searchKeyword = '';
  showForm = false;
  isLocating = false;

  mapCenter: google.maps.LatLngLiteral = { lat: 23.6978, lng: 120.9605 };
  mapZoom = 8;
  mapOptions: google.maps.MapOptions = {
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  };

  markers: {
    position: google.maps.LatLngLiteral;
    label: string;
    title: string;
    color: string;
    icon: { url: string; scaledSize: google.maps.Size };
  }[] = [];

  previewMarker: { position: google.maps.LatLngLiteral; icon: { url: string; scaledSize: google.maps.Size } } | any = null;


  polylinePath: google.maps.LatLngLiteral[] = [];
  polylineOptions: google.maps.PolylineOptions = {
    strokeColor: '#3b82f6',
    strokeOpacity: 0.8,
    strokeWeight: 3
  };

  autocompleteResults: TripLocationSearch[] = [];
  selectedLocationSearch: TripLocationSearch | null = null;
  isSearching = false;
  showDropdown = false;

  form = {
    locationId: 0,
    locationName: '',
    locationRole: '',
    note: '',
    sortOrder: 0
  };

  colors = [
    '#ef4444', '#f97316', '#eab308',
    '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'
  ];

  ngOnInit() {
    this.route.parent?.params.subscribe(params => {
      this.tripId = +params['id'];
      this.loadLocations();
    });

    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(keyword => {
      if (!keyword || keyword.length < 2) {
        this.autocompleteResults = [];
        this.showDropdown = false;
        this.isSearching = false;
        return;
      }

      this.locationSearchService.search(keyword).subscribe({
        next: (results) => {
          this.autocompleteResults = results;
          this.showDropdown = results.length > 0;
          this.isSearching = false;
        },
        error: () => this.isSearching = false
      });
    });
  }


  ngAfterViewInit() {
    this.locationSearchService.init();
  }

  loadLocations() {
    this.isLoading = true;
    this.tripService.getLocations(this.tripId).subscribe({
      next: (res) => {
        if (res.success) {
          this.locations = res.data;
          this.updateMarkers();
        }
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  updateMarkers() {
    this.markers = this.locations
      .filter(loc => loc.lat && loc.lng)
      .map((loc, i) => ({
        position: { lat: Number(loc.lat), lng: Number(loc.lng) },
        label: String(i + 1),
        title: loc.locationName,
        color: this.colors[i % this.colors.length],
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="${this.colors[i % this.colors.length]}" stroke="white" stroke-width="2"/>
              <text x="18" y="23" text-anchor="middle" fill="white" font-size="13" font-weight="bold" font-family="Arial">${i + 1}</text>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(36, 36)
        }
      }));

    this.polylinePath = this.markers.map(m => m.position);

    if (this.markers.length > 0) {
      this.mapCenter = this.markers[0].position;
      this.mapZoom = 12;
    }
  }

  selectLocation(loc: TripLocation) {
    this.selectedLocation = loc;
    if (loc.lat && loc.lng) {
      this.mapCenter = { lat: Number(loc.lat), lng: Number(loc.lng) };
      this.mapZoom = 15;
    }
  }
  getRoleClass(role: string): string {
    const map: Record<string, string> = {
      '集合點': 'badge badge-soft badge-info',
      '住宿': 'badge badge-soft badge-success',
      '餐廳': 'badge badge-soft badge-warning',
      '景點': 'badge badge-soft badge-error',
      '活動': 'badge badge-soft badge-secondary',
      '其他': 'badge badge-soft badge-neutral'
    };
    return map[role] ?? 'badge-primary';
  }
  getLocationColor(index: number): string {
    return this.colors[index % this.colors.length];
  }

  onDrop(event: CdkDragDrop<TripLocation[]>) {
    moveItemInArray(this.locations, event.previousIndex, event.currentIndex);
    this.updateMarkers();

    const items = this.locations.map((loc, i) => ({
      locationId: loc.id,
      sortOrder: i + 1
    }));

    this.tripService.updateLocationSort(this.tripId, items).subscribe();
  }

  onSearchInput(keyword: string) {
    this.form.locationName = keyword;
    this.isSearching = true;
    this.searchSubject.next(keyword);
  }

  selectSearchResult(result: TripLocationSearch) {
    this.form.locationName = result.name;
    this.showDropdown = false;
    this.isLocating = true;
    this.previewMarker = null;

    this.locationSearchService.getDetails(result).subscribe({
      next: (detail) => {
        this.selectedLocationSearch = detail;
        this.mapCenter = { lat: detail.lat, lng: detail.lng };
        this.mapZoom = 15;
        this.isLocating = false;

        this.previewMarker = {
          position: { lat: detail.lat, lng: detail.lng },
          icon: null
        };
      },
      error: () => this.isLocating = false
    });
  }


  openAddForm() {
    this.isEditing = false;
    this.form = { locationId: 0, locationName: '', locationRole: '', note: '', sortOrder: this.locations.length + 1 };
    this.selectedLocationSearch = null;
    this.autocompleteResults = [];
    this.showForm = true;
  }

  openEditForm(loc: TripLocation) {
    this.isEditing = true;
    this.form = {
      locationId: loc.id,
      locationName: loc.locationName,
      locationRole: loc.locationRole ?? '',
      note: loc.note ?? '',
      sortOrder: loc.sortOrder
    };
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.autocompleteResults = [];
    this.showDropdown = false;
    this.previewMarker = null;
  }

  saveLocation() {
    if (this.isEditing) {
      this.tripService.updateLocation(this.form.locationId, {
        locationRole: this.form.locationRole,
        note: this.form.note,
      }).subscribe({
        next: () => {
          this.loadLocations();
          this.closeForm();
        }
      });
    } else {
      if (!this.selectedLocationSearch) return;
      this.tripService.createLocation(this.tripId, {
        locationName: this.selectedLocationSearch.name,
        addressText: this.selectedLocationSearch.addressText,
        googlePlaceId: this.selectedLocationSearch.placeId,
        cityName: this.selectedLocationSearch.cityName,
        districtName: this.selectedLocationSearch.districtName,
        lat: this.selectedLocationSearch.lat,
        lng: this.selectedLocationSearch.lng,
        locationRole: this.form.locationRole,
        note: this.form.note,
        sortOrder: this.form.sortOrder
      }).subscribe({
        next: () => {
          this.loadLocations();
          this.closeForm();
        }
      });
    }
  }

  deleteLocation(id: number) {
    this.tripService.deleteLocation(id).subscribe({
      next: () => this.loadLocations()
    });
  }
}
