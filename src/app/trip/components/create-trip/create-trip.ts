import { Component, inject, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TripService } from '../../services/trip';
import { LocationSearchService } from '../../services/location-search';
import { TripLocationSearch } from '../../interfaces/trip';
import { NotificationService } from '../../../shared/notifyService/notification-service';

interface LocationDraft {
  locationName: string;
  addressText: string;
  googlePlaceId: string;
  cityName: string;
  districtName: string;
  lat: number;
  lng: number;
  locationRole: string;
  note: string;
}

interface GearDraft {
  itemName: string;
  isRequired: boolean;
}

@Component({
  selector: 'app-create-trip',
  imports: [FormsModule],
  templateUrl: './create-trip.html',
  styleUrl: './create-trip.css'
})
export class CreateTrip implements AfterViewInit {

  private tripService = inject(TripService);
  private router = inject(Router);
  private notify = inject(NotificationService);
  public locationSearchService = inject(LocationSearchService);

  currentStep = 1;
  isUploading = false;
  isSaving = false;
  errors: Record<string, string> = {};

  // 步驟一：基本資訊
  form = {
    title: '',
    description: '',
    tripType: '',
    startAt: '',
    endAt: '',
    capacity: 2,
    coverImageUrl: '',
    coverImagePublicId: ''
  };

  // 步驟二：地點
  locations: LocationDraft[] = [];
  autocompleteResults: TripLocationSearch[] = [];
  selectedLocationSearch: TripLocationSearch | null = null;
  isSearching = false;
  showDropdown = false;
  isLocating = false;
  locationForm = {
    locationName: '',
    locationRole: '',
    note: ''
  };

  // 步驟三：裝備
  gears: GearDraft[] = [];
  gearForm = {
    itemName: '',
    isRequired: false
  };

  ngAfterViewInit() {
    this.locationSearchService.init();
  }

  // ── 步驟控制 ──
  goToStep(step: number) {
    if (step === 2 && !this.validateStep1()) return;
    this.currentStep = step;
  }

  nextStep() {
    if (this.currentStep === 1 && !this.validateStep1()) return;
    this.currentStep++;
  }

  prevStep() {
    this.currentStep--;
  }

  // ── 步驟一驗證 ──
  validateStep1(): boolean {
    this.errors = {};
    if (!this.form.title) this.errors['title'] = '請填寫行程名稱';
    if (!this.form.tripType) this.errors['tripType'] = '請選擇行程類型';
    if (!this.form.startAt) this.errors['startAt'] = '請選擇出發日期';
    if (!this.form.capacity || this.form.capacity < 2) this.errors['capacity'] = '人數至少 2 人';
    if (this.form.endAt && this.form.endAt < this.form.startAt) this.errors['endAt'] = '結束日期不能早於出發日期';
    return Object.keys(this.errors).length === 0;
  }

  // ── 封面圖片 ──
  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.isUploading = true;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'salter-trip');
    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dn5drigh2/image/upload', { method: 'POST', body: formData });
      const data = await res.json();
      this.form.coverImageUrl = data.secure_url;
      this.form.coverImagePublicId = data.public_id;
    } catch (err) {
      this.notify.show('圖片上傳失敗', 'error');
    } finally {
      this.isUploading = false;
    }
  }

  removeCover() {
    this.form.coverImageUrl = '';
    this.form.coverImagePublicId = '';
  }

  // ── 步驟二：地點 ──
  onSearchInput(keyword: string) {
    this.locationForm.locationName = keyword;
    if (!keyword || keyword.length < 2) {
      this.autocompleteResults = [];
      this.showDropdown = false;
      return;
    }
    this.isSearching = true;
    this.locationSearchService.search(keyword).subscribe({
      next: (results) => {
        this.autocompleteResults = results;
        this.showDropdown = results.length > 0;
        this.isSearching = false;
        if (results.length > 0) this.locationSearchService.prefetchDetails([results[0]]);
      },
      error: () => this.isSearching = false
    });
  }

  selectSearchResult(result: TripLocationSearch) {
    this.locationForm.locationName = result.name;
    this.showDropdown = false;
    this.isLocating = true;
    this.locationSearchService.getDetails(result).subscribe({
      next: (detail) => {
        this.selectedLocationSearch = detail;
        this.isLocating = false;
      },
      error: () => this.isLocating = false
    });
  }

  addLocation() {
    if (!this.selectedLocationSearch) {
      this.notify.show('請先從下拉選單選擇地點', 'error');
      return;
    }
    this.locations.push({
      locationName: this.selectedLocationSearch.name,
      addressText: this.selectedLocationSearch.addressText ?? '',
      googlePlaceId: this.selectedLocationSearch.placeId ?? '',
      cityName: this.selectedLocationSearch.cityName ?? '',
      districtName: this.selectedLocationSearch.districtName ?? '',
      lat: this.selectedLocationSearch.lat,
      lng: this.selectedLocationSearch.lng,
      locationRole: this.locationForm.locationRole,
      note: this.locationForm.note
    });
    this.locationForm = { locationName: '', locationRole: '', note: '' };
    this.selectedLocationSearch = null;
    this.autocompleteResults = [];
  }

  removeLocation(index: number) {
    this.locations.splice(index, 1);
  }

  // ── 步驟三：裝備 ──
  addGear() {
    if (!this.gearForm.itemName) return;
    this.gears.push({ ...this.gearForm });
    this.gearForm = { itemName: '', isRequired: false };
  }

  removeGear(index: number) {
    this.gears.splice(index, 1);
  }

  // ── 步驟四：送出 ──
  submit() {
    this.isSaving = true;
    this.tripService.createTrip({
      title: this.form.title,
      description: this.form.description,
      tripType: this.form.tripType,
      startAt: this.form.startAt,
      endAt: this.form.endAt || null,
      capacity: this.form.capacity,
      coverImageUrl: this.form.coverImageUrl || null,
      coverImagePublicId: this.form.coverImagePublicId || null
    }).subscribe({
      next: (res) => {
        console.log('res.data:', res.data);
        if (res.success) {
          const tripId = Number(res.data);// 後端回傳的行程 ID
          this.createLocationsAndGears(tripId);
        } else {
          this.isSaving = false;
        }
      },
      error: () => {
        this.notify.show('建立行程失敗', 'error');
        this.isSaving = false;
      }
    });
  }

  private createLocationsAndGears(tripId: number) {
    const locationRequests = this.locations.map((loc, i) =>
      this.tripService.createLocation(tripId, { ...loc, sortOrder: i + 1 }).toPromise()
    );
    const gearRequests = this.gears.map(gear =>
      this.tripService.createGearItem(tripId, gear).toPromise()
    );

    Promise.all([...locationRequests, ...gearRequests]).then(() => {
      this.notify.show('行程建立成功！', 'success');
      this.router.navigate(['/trip/detail', tripId, 'location']);
    }).catch(() => {
      this.notify.show('行程已建立，但部分地點或裝備新增失敗', 'error');
      this.router.navigate(['/trip/explore']);
    }).finally(() => {
      this.isSaving = false;
    });
  }

  goBack() {
    this.router.navigate(['/trip/explore']);
  }

  getTripTypeLabel(type: string): string {
    const map: Record<string, string> = {
      surf: '🏄 衝浪', dive: '🤿 深潛', snorkel: '🤿 浮潛',
      kayak: '🚣 獨木舟', sailing: '⛵ 帆船', sup: '🏄 立槳'
    };
    return map[type] ?? type;
  }
}
