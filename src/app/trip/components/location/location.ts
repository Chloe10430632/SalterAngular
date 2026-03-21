import { Component, OnInit, inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TripService } from '../../services/trip';
import { TripLocation, TripLocationSearch } from '../../interfaces/trip';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-location',
  imports: [FormsModule, GoogleMapsModule],
  templateUrl: './location.html',
  styleUrl: './location.css'
})
export class Location implements OnInit, AfterViewInit {

  private tripService = inject(TripService);
  private route = inject(ActivatedRoute);

  @ViewChild('searchInput') searchInput!: ElementRef;

  tripId = 0;
  locations: TripLocation[] = [];
  selectedLocation: TripLocation | null = null;
  isLoading = false;
  isEditing = false;
  searchKeyword = '';

  // Google Maps 設定
  mapCenter: google.maps.LatLngLiteral = { lat: 23.6978, lng: 120.9605 }; // 台灣中心
  mapZoom = 8;
  mapOptions: google.maps.MapOptions = {
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  };

  // 地圖上的 Markers
  markers: { position: google.maps.LatLngLiteral; label: string; title: string; color: string }[] = [];

  // Autocomplete 搜尋結果
  autocompleteResults: TripLocationSearch[] = [];
  selectedLocationSearch: TripLocationSearch | null = null;
  isSearching = false;
  showDropdown = false;

  // 表單
  form = {
    locationId: 0,
    locationName: '',
    locationRole: '',
    note: '',
    sortOrder: 0
  };

  // 地點顏色
  colors = [
    '#ef4444', '#f97316', '#eab308',
    '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'
  ];

  ngOnInit() {
    this.route.parent?.params.subscribe(params => {
      this.tripId = +params['id'];
      this.loadLocations();
    });
  }

  ngAfterViewInit() { }

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

  // 更新地圖上的 Markers
  updateMarkers() {
    this.markers = this.locations
      .filter(loc => loc.lat && loc.lng)
      .map((loc, i) => ({
        position: { lat: Number(loc.lat), lng: Number(loc.lng) },
        label: String(i + 1),
        title: loc.locationName,
        color: this.colors[i % this.colors.length]
      }));

    // 如果有地點，地圖移到第一個地點
    if (this.markers.length > 0) {
      this.mapCenter = this.markers[0].position;
      this.mapZoom = 12;
    }
  }

  selectLocation(loc: TripLocation) {
    this.selectedLocation = loc;
    // 地圖移到選中的地點
    if (loc.lat && loc.lng) {
      this.mapCenter = { lat: Number(loc.lat), lng: Number(loc.lng) };
      this.mapZoom = 15;
    }
  }

  getLocationColor(index: number): string {
    return this.colors[index % this.colors.length];
  }

  // 搜尋地點（呼叫後端 API）
  onSearchInput(keyword: string) {
    if (!keyword || keyword.length < 2) {
      this.autocompleteResults = [];
      this.showDropdown = false;
      return;
    }

    this.isSearching = true;
    this.tripService.getAllLocations(keyword).subscribe({
      next: (res) => {
        if (res.success) {
          this.autocompleteResults = res.data;
          this.showDropdown = true;
        }
        this.isSearching = false;
      }
    });
  }

  // 選擇搜尋結果
  selectSearchResult(result: TripLocationSearch) {
    this.selectedLocationSearch = result;
    this.form.locationId = result.id;
    this.form.locationName = result.name;
    this.showDropdown = false;

    // 地圖移到選中的地點
    if (result.lat && result.lng) {
      this.mapCenter = { lat: result.lat, lng: result.lng };
      this.mapZoom = 15;
    }
  }

  openAddModal() {
    this.isEditing = false;
    this.form = { locationId: 0, locationName: '', locationRole: '', note: '', sortOrder: this.locations.length + 1 };
    this.selectedLocationSearch = null;
    this.autocompleteResults = [];
    (document.getElementById('location_modal') as HTMLDialogElement).showModal();
  }

  openEditModal(loc: TripLocation) {
    this.isEditing = true;
    this.form = {
      locationId: loc.id,
      locationName: loc.locationName,
      locationRole: loc.locationRole ?? '',
      note: loc.note ?? '',
      sortOrder: loc.sortOrder
    };
    (document.getElementById('location_modal') as HTMLDialogElement).showModal();
  }

  saveLocation() {
    if (this.isEditing) {
      this.tripService.updateLocation(this.form.locationId, {
        locationRole: this.form.locationRole,
        note: this.form.note,
        sortOrder: this.form.sortOrder
      }).subscribe({
        next: () => {
          this.loadLocations();
          (document.getElementById('location_modal') as HTMLDialogElement).close();
        }
      });
    } else {
      if (!this.selectedLocationSearch) return;
      this.tripService.createLocation(this.tripId, {
        locationId: this.selectedLocationSearch.id,
        locationRole: this.form.locationRole,
        note: this.form.note,
        sortOrder: this.form.sortOrder
      }).subscribe({
        next: () => {
          this.loadLocations();
          (document.getElementById('location_modal') as HTMLDialogElement).close();
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
