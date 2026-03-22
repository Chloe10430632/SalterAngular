import { Component, OnInit, inject, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TripService } from '../../services/trip';
import { TripLocation, TripLocationSearch } from '../../interfaces/trip';
import { GoogleMapsModule } from '@angular/google-maps';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-location',
  imports: [FormsModule, GoogleMapsModule, DragDropModule],
  templateUrl: './location.html',
  styleUrl: './location.css'
})
export class Location implements OnInit, AfterViewInit {

  private tripService = inject(TripService);
  private route = inject(ActivatedRoute);

  tripId = 0;
  locations: TripLocation[] = [];
  selectedLocation: TripLocation | null = null;
  isLoading = false;
  isEditing = false;
  searchKeyword = '';

  mapCenter: google.maps.LatLngLiteral = { lat: 23.6978, lng: 120.9605 };
  mapZoom = 8;
  mapOptions: google.maps.MapOptions = {
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  };

  markers: { position: google.maps.LatLngLiteral; label: string; title: string; color: string }[] = [];

  // 地圖連線
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

  private autocompleteService!: google.maps.places.AutocompleteService;
  private placesService!: google.maps.places.PlacesService;

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
  }

  ngAfterViewInit() {
    this.autocompleteService = new google.maps.places.AutocompleteService();
    const mapDiv = document.createElement('div');
    this.placesService = new google.maps.places.PlacesService(
      new google.maps.Map(mapDiv)
    );
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
        color: this.colors[i % this.colors.length]
      }));

    // 更新連線路徑
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

  getLocationColor(index: number): string {
    return this.colors[index % this.colors.length];
  }

  // 拖曳排序
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
    if (!keyword || keyword.length < 2) {
      this.autocompleteResults = [];
      this.showDropdown = false;
      return;
    }

    this.isSearching = true;
    this.autocompleteService.getPlacePredictions(
      { input: keyword, language: 'zh-TW' },
      (predictions, status) => {
        this.isSearching = false;
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          this.autocompleteResults = predictions.map(p => ({
            id: 0,
            placeId: p.place_id,
            name: p.structured_formatting.main_text,
            addressText: p.structured_formatting.secondary_text,
            lat: 0,
            lng: 0
          }));
          this.showDropdown = true;
        } else {
          this.autocompleteResults = [];
          this.showDropdown = false;
        }
      }
    );
  }

  selectSearchResult(result: TripLocationSearch) {
    this.form.locationName = result.name;
    this.showDropdown = false;

    this.placesService.getDetails(
      { placeId: result.placeId!, fields: ['geometry', 'name', 'address_components', 'formatted_address'] },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          const components = place.address_components || [];
          const cityComp = components.find(c => c.types.includes('administrative_area_level_1'));
          const districtComp = components.find(c =>
            c.types.includes('administrative_area_level_2') || c.types.includes('locality')
          );

          this.selectedLocationSearch = {
            ...result,
            lat,
            lng,
            cityName: cityComp?.long_name ?? '',
            districtName: districtComp?.long_name ?? '',
            addressText: place.formatted_address ?? result.addressText
          };

          this.mapCenter = { lat, lng };
          this.mapZoom = 15;
        }
      }
    );
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
