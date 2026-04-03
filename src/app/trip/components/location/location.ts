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
  public locationSearchService = inject(LocationSearchService);
  private route = inject(ActivatedRoute);
  private searchSubject = new Subject<string>();

  tripId = 0;
  locations: TripLocation[] = [];
  selectedLocation: TripLocation | null = null;
  isLoading = false;
  isEditing = false;
  showForm = false;
  isLocating = false;
  hasPermission = true;
  isSearching = false;
  showDropdown = false;

  totalDays = 1;
  selectedDay = 1;

  confirmingRemoveDayNumber: number | null = null;
  confirmingDeleteLocationId: number | null = null;

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

  previewMarker: any = null;

  polylines: { path: google.maps.LatLngLiteral[]; options: google.maps.PolylineOptions }[] = [];

  autocompleteResults: TripLocationSearch[] = [];
  selectedLocationSearch: TripLocationSearch | null = null;

  form = {
    locationId: 0,
    locationName: '',
    locationRole: '',
    note: '',
    sortOrder: 0,
    dayNumber: 1
  };

  dayColors = [
    '#ef4444', '#3b82f6', '#22c55e', '#f97316',
    '#8b5cf6', '#ec4899', '#eab308', '#06b6d4'
  ];

  get locationsByDay(): TripLocation[] {
    return this.locations.filter(loc => loc.dayNumber === this.selectedDay);
  }

  get days(): number[] {
    return Array.from({ length: this.totalDays }, (_, i) => i + 1);
  }

  ngOnInit() {
    const parentParams = this.route.parent?.snapshot.params;
    const grandParentParams = this.route.parent?.parent?.snapshot.params;
    this.tripId = +(parentParams?.['id'] ?? grandParentParams?.['id'] ?? 0);
    this.loadLocations();

    this.searchSubject.pipe(
      debounceTime(500),
      // distinctUntilChanged()
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
          if (results.length > 0) this.locationSearchService.prefetchDetails([results[0]]);
        },
        error: () => this.isSearching = false
      });
    });
  }

  ngAfterViewInit() {
    this.locationSearchService.init();
  }

  loadLocations(keepDay?: number) {
    this.isLoading = true;
    this.tripService.getLocations(this.tripId).subscribe({
      next: (res) => {
        if (res.success) {
          this.locations = res.data;
          this.totalDays = this.locations.length > 0
            ? Math.max(...this.locations.map(l => l.dayNumber))
            : 1;
          if (keepDay !== undefined) this.selectedDay = keepDay;
          this.updateMarkers();
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.hasPermission = false;
      }
    });
  }

  updateMarkers() {
    this.markers = [];
    this.polylines = [];

    for (let day = 1; day <= this.totalDays; day++) {
      const dayColor = this.dayColors[(day - 1) % this.dayColors.length];
      const dayLocations = this.locations
        .filter(loc => loc.dayNumber === day && loc.lat && loc.lng)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      dayLocations.forEach((loc, i) => {
        this.markers.push({
          position: { lat: Number(loc.lat), lng: Number(loc.lng) },
          label: String(i + 1),
          title: loc.locationName,
          color: dayColor,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="${dayColor}" stroke="white" stroke-width="2"/>
                <text x="18" y="23" text-anchor="middle" fill="white" font-size="13" font-weight="bold" font-family="Arial">${i + 1}</text>
              </svg>
            `)}`,
            scaledSize: new google.maps.Size(36, 36)
          }
        });
      });

      if (dayLocations.length > 1) {
        this.polylines.push({
          path: dayLocations.map(loc => ({ lat: Number(loc.lat), lng: Number(loc.lng) })),
          options: {
            strokeColor: dayColor,
            strokeOpacity: 0.8,
            strokeWeight: 3
          }
        });
      }
    }
  }

  selectDay(day: number) {
    this.selectedDay = day;
    const dayLocs = this.locations
      .filter(loc => loc.dayNumber === day && loc.lat && loc.lng)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    if (dayLocs.length === 0) return;

    if (dayLocs.length === 1) {
      this.mapCenter = { lat: Number(dayLocs[0].lat), lng: Number(dayLocs[0].lng) };
      this.mapZoom = 13;
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    dayLocs.forEach(loc => bounds.extend({ lat: Number(loc.lat), lng: Number(loc.lng) }));
    const center = bounds.getCenter();
    this.mapCenter = { lat: center.lat(), lng: center.lng() };

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const latDiff = Math.abs(ne.lat() - sw.lat());
    const lngDiff = Math.abs(ne.lng() - sw.lng());
    const maxDiff = Math.max(latDiff, lngDiff);

    if (maxDiff < 0.01) this.mapZoom = 14;
    else if (maxDiff < 0.05) this.mapZoom = 12;
    else if (maxDiff < 0.1) this.mapZoom = 11;
    else if (maxDiff < 0.5) this.mapZoom = 10;
    else this.mapZoom = 8;
  }

  addDay() {
    this.totalDays++;
    this.selectedDay = this.totalDays;
  }

  removeDay(day: number) {
    if (this.totalDays <= 1) return;
    this.locations.forEach(loc => {
      if (loc.dayNumber === day) loc.dayNumber = 1;
      else if (loc.dayNumber > day) loc.dayNumber--;
    });
    this.totalDays--;
    if (this.selectedDay > this.totalDays) this.selectedDay = this.totalDays;
    this.updateMarkers();
  }

  requestRemoveDay(day: number) {
    this.confirmingRemoveDayNumber = day;
  }

  confirmRemoveDay() {
    if (!this.confirmingRemoveDayNumber) return;
    const day = this.confirmingRemoveDayNumber;
    this.confirmingRemoveDayNumber = null;

    const dayLocs = this.locations.filter(loc => loc.dayNumber === day);
    const deletePromises = dayLocs.map(loc =>
      this.tripService.deleteLocation(loc.id).toPromise()
    );

    Promise.all(deletePromises).then(() => {
      this.locations = this.locations.filter(loc => loc.dayNumber !== day);
      this.locations.forEach(loc => {
        if (loc.dayNumber > day) loc.dayNumber--;
      });
      this.totalDays--;
      if (this.selectedDay > this.totalDays) this.selectedDay = this.totalDays;
      this.updateMarkers();
    });
  }

  selectLocation(loc: TripLocation) {
    this.selectedLocation = loc;
    if (loc.lat && loc.lng) {
      this.mapCenter = { lat: Number(loc.lat), lng: Number(loc.lng) };
      this.mapZoom = 15;
    }
  }
  onDrop(event: CdkDragDrop<TripLocation[]>) {
    const dayLocs = this.locations.filter(loc => loc.dayNumber === this.selectedDay);
    const fromIndex = this.locations.indexOf(dayLocs[event.previousIndex]);
    const toIndex = this.locations.indexOf(dayLocs[event.currentIndex]);
    moveItemInArray(this.locations, fromIndex, toIndex);

    this.locations
      .filter(loc => loc.dayNumber === this.selectedDay)
      .forEach((loc, i) => { loc.sortOrder = i + 1; });

    this.updateMarkers();

    const items = this.locations.map(loc => ({
      locationId: loc.id,
      sortOrder: loc.sortOrder
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
        this.previewMarker = { position: { lat: detail.lat, lng: detail.lng }, icon: null };
      },
      error: () => this.isLocating = false
    });
  }

  openAddForm() {
    const dayLocs = this.locations.filter(loc => loc.dayNumber === this.selectedDay);
    const maxSortOrder = dayLocs.length > 0
      ? Math.max(...dayLocs.map(l => l.sortOrder))
      : 0;

    this.isEditing = false;
    this.form = {
      locationId: 0,
      locationName: '',
      locationRole: '',
      note: '',
      sortOrder: maxSortOrder + 1,
      dayNumber: this.selectedDay
    };
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
      sortOrder: loc.sortOrder,
      dayNumber: loc.dayNumber
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
        dayNumber: this.form.dayNumber
      }).subscribe({
        next: () => {
          this.loadLocations(this.selectedDay);
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
        sortOrder: this.form.sortOrder,
        dayNumber: this.form.dayNumber
      }).subscribe({
        next: () => {
          const newLat = this.selectedLocationSearch!.lat;
          const newLng = this.selectedLocationSearch!.lng;
          const currentDay = this.form.dayNumber;
          this.loadLocations(currentDay);
          this.closeForm();
          this.mapCenter = { lat: newLat, lng: newLng };
          this.mapZoom = 15;
        }
      });
    }
  }

  requestDeleteLocation(id: number) {
    this.confirmingDeleteLocationId = id;
  }

  confirmDeleteLocation() {
    if (!this.confirmingDeleteLocationId) return;
    const id = this.confirmingDeleteLocationId;
    this.tripService.deleteLocation(id).subscribe({
      next: () => {
        this.locations = this.locations.filter(loc => loc.id !== id);
        this.confirmingDeleteLocationId = null;
        this.updateMarkers();
      }
    });
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

  getDayColor(day: number): string {
    return this.dayColors[(day - 1) % this.dayColors.length];
  }
}
