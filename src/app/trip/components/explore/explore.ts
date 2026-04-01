import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TripService } from '../../services/trip';
import { TripSummary } from '../../interfaces/trip';
import { NotificationService } from '../../../shared/notifyService/notification-service';

@Component({
  selector: 'app-explore',
  imports: [FormsModule, DatePipe],
  templateUrl: './explore.html',
  styleUrl: './explore.css'
})
export class Explore implements OnInit {

  private tripService = inject(TripService);
  private router = inject(Router);
  private notify = inject(NotificationService);

  // 資料
  trips: TripSummary[] = [];
  totalCount = 0;
  totalPages = 0;
  currentPage = 1;
  isLoading = false;

  // 搜尋
  searchKeyword = '';

  showShareId: number | null = null;


  // 分類
  selectedCategory = '';
  categories = [
    { label: '全部', value: '' },
    { label: '🏄 衝浪', value: 'surf' },
    { label: '⚓ 深潛', value: 'dive' },
    { label: '🤿 浮潛', value: 'snorkel' },
    { label: '🚣 獨木舟', value: 'kayak' },
    { label: '⛵ 帆船', value: 'sailing' },
    { label: '🏄 SUP 立槳', value: 'sup' },
    { label: '🌊 其他', value: 'other' },
  ];

  // 篩選
  filter = { startFrom: '', startTo: '' };

  // 人數
  selectedCapacity = '不限';
  capacities = [
    { label: '不限', min: null as number | null, max: null as number | null },
    { label: '2–4', min: 2, max: 4 },
    { label: '5–8', min: 5, max: 8 },
    { label: '9+', min: 9, max: null as number | null },
  ];

  // 狀態
  statuses = [
    { label: '揪團中', value: 'active', checked: true },
    { label: '即將成行', value: 'locked', checked: false },
    { label: '已結束', value: 'completed', checked: false },
  ];

  ngOnInit() {
    this.loadTrips();
  }

  loadTrips() {
    this.isLoading = true;

    const selectedCap = this.capacities.find(c => c.label === this.selectedCapacity);
    const selectedStatuses = this.statuses
      .filter(s => s.checked)
      .map(s => s.value)
      .join(',');

    this.tripService.getTrips({
      keyword: this.searchKeyword || undefined,
      tripType: this.selectedCategory || undefined,
      status: selectedStatuses || undefined,
      startFrom: this.filter.startFrom || undefined,
      startTo: this.filter.startTo || undefined,
      minCapacity: selectedCap?.min ?? undefined,
      maxCapacity: selectedCap?.max ?? undefined,
      page: this.currentPage,
      pageSize: 9
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.trips = res.data.trips;
          this.totalCount = res.data.totalCount;
          this.totalPages = res.data.totalPages;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onSearch() {
    this.searchKeyword = this.searchKeyword.trim();
    this.currentPage = 1;
    this.loadTrips();
  }

  selectCategory(value: string) {
    this.selectedCategory = value;
    this.currentPage = 1;
    this.loadTrips();
  }

  selectCapacity(cap: any) {
    this.selectedCapacity = cap.label;
    this.currentPage = 1;
  }

  applyFilter() {
    this.currentPage = 1;
    this.loadTrips();
  }

  clearFilter() {
    this.filter = { startFrom: '', startTo: '' };
    this.selectedCapacity = '不限';
    this.statuses.forEach(s => s.checked = false);
    this.selectedCategory = '';
    this.searchKeyword = '';
    this.currentPage = 1;
    this.loadTrips();
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadTrips();
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  toggleFavorite(trip: TripSummary, event: Event) {
    event.stopPropagation();
    if (trip.isFavorite) {
      this.tripService.removeFavorite(trip.id).subscribe({
        next: () => {
          const t = this.trips.find(t => t.id === trip.id);
          if (t) t.isFavorite = false;
        }
      });
    } else {
      this.tripService.addFavorite(trip.id).subscribe({
        next: () => {
          const t = this.trips.find(t => t.id === trip.id);
          if (t) t.isFavorite = true;
        }
      });
    }
  }

  goToDetail(id: number) {
    this.router.navigate(['/trip/detail', id]);
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      active: '揪團中',
      locked: '即將成行',
      completed: '已結束',
      cancelled: '已取消'
    };
    return map[status] ?? status;
  }

  getStatusBadgeClass(status: string): string {
    const map: Record<string, string> = {
      active: 'badge-success',
      locked: 'badge-warning',
      completed: 'badge-ghost',
      cancelled: 'badge-error'
    };
    return map[status] ?? 'badge-ghost';
  }

  getTripTypeLabel(type: string): string {
    const map: Record<string, string> = {
      surf: '🏄 衝浪',
      dive: '⚓ 深潛',
      snorkel: '🤿 浮潛',
      kayak: '🚣 獨木舟',
      sailing: '⛵ 帆船',
      sup: '🏄 SUP 立槳',
      other: '🌊 其他'
    };
    return map[type] ?? type;
  }

  copyLink(tripId: number) {
    const url = `${window.location.origin}/trip/detail/${tripId}`;
    navigator.clipboard.writeText(url).then(() => {
      this.notify.show('已複製行程連結！', 'success');
      this.showShareId = null;
    });
  }

  toggleShare(tripId: number, event: Event) {
    event.stopPropagation();
    this.showShareId = this.showShareId === tripId ? null : tripId;
  }
}
