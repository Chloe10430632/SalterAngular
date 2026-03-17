import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explore',
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './explore.html',
  styleUrl: './explore.css'
})
export class Explore implements OnInit {

  // 資料
  trips: any[] = [];
  totalCount = 0;
  totalPages = 0;
  currentPage = 1;
  isLoading = false;

  // 搜尋
  searchKeyword = '';

  // 分類
  selectedCategory = '';
  categories = [
    { label: '全部', value: '' },
    { label: '🏄 衝浪', value: 'surf' },
    { label: '🤿 浮潛', value: 'snorkel' },
    { label: '🧗 登山', value: 'hiking' },
    { label: '🏕️ 露營', value: 'camping' },
    { label: '🚵 單車', value: 'cycling' },
    { label: '🍜 美食', value: 'food' },
  ];

  // 篩選
  filter = {
    startFrom: '',
    startTo: '',
  };

  // 人數
  selectedCapacity = '不限';
  capacities = [
    { label: '不限', min: null, max: null },
    { label: '2–4', min: 2, max: 4 },
    { label: '5–8', min: 5, max: 8 },
    { label: '9+', min: 9, max: null },
  ];

  // 狀態
  statuses = [
    { label: '揪團中', value: 'active', checked: true },
    { label: '即將成行', value: 'locked', checked: false },
    { label: '已結束', value: 'completed', checked: false },
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    this.loadTrips();
  }

  loadTrips() {
    this.isLoading = true;
    // TODO: 串接 API
    // 先用假資料測試
    setTimeout(() => {
      this.trips = [];
      this.totalCount = 0;
      this.totalPages = 1;
      this.isLoading = false;
    }, 500);
  }

  onSearch() {
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
    this.statuses.forEach(s => s.checked = s.value === 'active');
    this.selectedCategory = '';
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

  toggleFavorite(trip: any, event: Event) {
    event.stopPropagation();
    trip.isFavorite = !trip.isFavorite;
    // TODO: 串接收藏 API
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
      snorkel: '🤿 浮潛',
      hiking: '🧗 登山',
      camping: '🏕️ 露營',
      cycling: '🚵 單車',
      food: '🍜 美食',
    };
    return map[type] ?? type;
  }
}
