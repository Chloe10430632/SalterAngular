import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TripService } from '../../services/trip';
import { TripLocation } from '../../interfaces/trip';

@Component({
  selector: 'app-location',
  imports: [FormsModule],
  templateUrl: './location.html',
  styleUrl: './location.css'
})
export class Location implements OnInit {

  private tripService = inject(TripService);
  private route = inject(ActivatedRoute);

  tripId = 0;
  locations: TripLocation[] = [];
  selectedLocation: TripLocation | null = null;
  isLoading = false;
  isEditing = false;
  searchKeyword = '';

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
    '#22c55e', '#3b82f6', '#8b5cf6',
    '#ec4899'
  ];

  ngOnInit() {
    this.route.parent?.params.subscribe(params => {
      this.tripId = +params['id'];
      this.loadLocations();
    });
  }

  loadLocations() {
    this.isLoading = true;
    this.tripService.getLocations(this.tripId).subscribe({
      next: (res) => {
        if (res.success) {
          this.locations = res.data;
        }
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  selectLocation(loc: TripLocation) {
    this.selectedLocation = loc;
  }

  getLocationColor(index: number): string {
    return this.colors[index % this.colors.length];
  }

  openAddModal() {
    this.isEditing = false;
    this.form = { locationId: 0, locationName: '', locationRole: '', note: '', sortOrder: this.locations.length + 1 };
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
      // TODO: 新增地點需要 locationId（從 Google Autocomplete 取得）
    }
  }

  deleteLocation(id: number) {
    this.tripService.deleteLocation(id).subscribe({
      next: () => this.loadLocations()
    });
  }
}
