import { Component, inject, AfterViewInit, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TripService } from '../../services/trip';
import { LocationSearchService } from '../../services/location-search';
import { TripLocationSearch } from '../../interfaces/trip';
import { NotificationService } from '../../../shared/notifyService/notification-service';
import { forkJoin, of } from 'rxjs';

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
  imports: [ReactiveFormsModule],
  templateUrl: './create-trip.html',
  styleUrl: './create-trip.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CreateTrip implements OnInit, AfterViewInit {

  private fb = inject(FormBuilder);
  private tripService = inject(TripService);
  public router = inject(Router);
  private notify = inject(NotificationService);
  public locationSearchService = inject(LocationSearchService);

  currentStep = 1;
  isUploading = false;
  isSaving = false;
  isDragging = false;
  today = new Date().toISOString().split('T')[0];
  showStartPicker = false;
  showEndPicker = false;
  showLoginRequired = false;
  countdown = 6;
  showCoverPreview = false;
  coverPreview = '';

  // ── 步驟一表單 ──
  step1Form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: [''],
    tripType: ['', Validators.required],
    startAt: ['', Validators.required],
    endAt: ['', Validators.required],
    capacity: [2, [Validators.required, Validators.min(2), Validators.max(50)]],
    coverImageUrl: [''],
    coverImagePublicId: ['']
  });

  // ── 步驟二表單 ──
  locationForm: FormGroup = this.fb.group({
    locationName: [''],
    locationRole: [''],
    note: ['']
  });

  // ── 步驟三表單 ──
  gearForm: FormGroup = this.fb.group({
    itemName: ['', Validators.required],
    isRequired: [false]
  });

  // 暫存清單
  locations: LocationDraft[] = [];
  gears: GearDraft[] = [];

  // 地點搜尋
  autocompleteResults: TripLocationSearch[] = [];
  selectedLocationSearch: TripLocationSearch | null = null;
  isSearching = false;
  showDropdown = false;
  isLocating = false;

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.showLoginRequired = true;
      const timer = setInterval(() => {
        this.countdown--;
        if (this.countdown === 0) {
          clearInterval(timer);
          this.router.navigate(['/login']);
        }
      }, 1000);
    }
  }

  ngAfterViewInit() {
    this.locationSearchService.init();
    import('cally');
  }

  // ── 步驟控制 ──
  nextStep() {
    if (this.currentStep === 1) {
      this.step1Form.markAllAsTouched();
      if (!this.validateStep1()) return;
    }
    this.currentStep++;
  }

  prevStep() {
    this.currentStep--;
  }

  validateStep1(): boolean {
    if (this.step1Form.invalid) return false;
    const { startAt, endAt } = this.step1Form.value;
    if (endAt && endAt < startAt) {
      this.step1Form.get('endAt')?.setErrors({ endBeforeStart: true });
      return false;
    }
    return true;
  }

  get f() { return this.step1Form.controls; }

  // ── 日期選擇 ──
  onStartDateChange(event: Event) {
    const value = (event as CustomEvent).detail ?? (event.target as any).value ?? '';
    this.step1Form.patchValue({ startAt: value });
    this.showStartPicker = false;
    const endAt = this.step1Form.get('endAt')?.value;
    if (endAt && endAt < value) {
      this.step1Form.patchValue({ endAt: '' });
    }
  }

  onEndDateChange(event: Event) {
    const value = (event as CustomEvent).detail ?? (event.target as any).value ?? '';
    this.step1Form.patchValue({ endAt: value });
    this.showEndPicker = false;
  }

  // ── 封面圖片 ──
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) this.uploadFile(file);
  }

  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    await this.uploadFile(file);
  }

  async uploadFile(file: File) {
    this.isUploading = true;
    const reader = new FileReader();
    reader.onload = () => this.coverPreview = reader.result as string;
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'salter-trip');
    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dn5drigh2/image/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (!res.ok) {
        console.error('Cloudinary 上傳失敗:', data);
        this.notify.show('圖片上傳失敗', 'error');
        this.coverPreview = '';
        return;
      }

      this.step1Form.patchValue({
        coverImageUrl: data.secure_url,
        coverImagePublicId: data.public_id
      });
    } catch (err) {
      console.error('上傳失敗:', err);
      this.notify.show('圖片上傳失敗', 'error');
      this.coverPreview = '';
    } finally {
      this.isUploading = false;
    }
  }

  removeCover() {
    this.step1Form.patchValue({ coverImageUrl: '', coverImagePublicId: '' });
    this.coverPreview = '';
  }

  // ── 地點搜尋 ──
  onSearchInput(keyword: string) {
    this.locationForm.patchValue({ locationName: keyword });
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
    this.locationForm.patchValue({ locationName: result.name });
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
      locationRole: this.locationForm.value.locationRole,
      note: this.locationForm.value.note
    });
    this.locationForm.reset({ locationName: '', locationRole: '', note: '' });
    this.selectedLocationSearch = null;
    this.autocompleteResults = [];
  }

  removeLocation(index: number) {
    this.locations.splice(index, 1);
  }

  // ── 裝備 ──
  addGear() {
    if (this.gearForm.invalid) return;
    this.gears.push({ ...this.gearForm.value });
    this.gearForm.reset({ itemName: '', isRequired: false });
  }

  removeGear(index: number) {
    this.gears.splice(index, 1);
  }

  // ── 送出 ──
  submit() {
    this.isSaving = true;
    const v = this.step1Form.value;
    this.tripService.createTrip({
      title: v.title,
      description: v.description,
      tripType: v.tripType,
      startAt: v.startAt,
      endAt: v.endAt || null,
      capacity: v.capacity,
      coverImageUrl: v.coverImageUrl || null,
      coverImagePublicId: v.coverImagePublicId || null
    }).subscribe({
      next: (res) => {
        if (res.success) {
          const tripId = Number(res.data);
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
      this.tripService.createLocation(tripId, { ...loc, sortOrder: i + 1 })
    );
    const gearRequests = this.gears.map(gear =>
      this.tripService.createGearItem(tripId, gear)
    );

    const all = [...locationRequests, ...gearRequests];

    const source$ = all.length > 0 ? forkJoin(all) : of([]);

    source$.subscribe({
      next: () => {
        this.notify.show('行程建立成功！', 'success');
        this.router.navigate(['/trip/detail', tripId, 'location']);
      },
      error: () => {
        this.notify.show('行程已建立，但部分地點或裝備新增失敗', 'error');
        this.router.navigate(['/trip/explore']);
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/trip/explore']);
  }

  getTripTypeLabel(type: string): string {
    const map: Record<string, string> = {
      surf: '🏄 衝浪', dive: '⚓ 深潛', snorkel: '🤿 浮潛',
      kayak: '🚣 獨木舟', sailing: '⛵ 帆船', sup: '🏄 SUP　立槳', other: '🌊 其他'
    };
    return map[type] ?? type;
  }


}
