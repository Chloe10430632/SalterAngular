import { Component, OnInit, inject, NgZone, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TripService } from '../../services/trip';
import { TripSummary, TripFavoriteFolder } from '../../interfaces/trip';

@Component({
  selector: 'app-favorites',
  imports: [DatePipe, NgClass, RouterLink, FormsModule],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class Favorites implements OnInit {

  private tripService = inject(TripService);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private el = inject(ElementRef);

  trips: TripSummary[] = [];
  folders: TripFavoriteFolder[] = [];
  isLoading = true;
  showLoginRequired = false;
  countdown = 6;
  confirmingRemoveId: number | null = null;

  // 資料夾相關
  currentFolderId: number | null = null; // null 代表根目錄
  showCreateFolder = false;
  newFolderName = '';
  editingFolderId: number | null = null;
  editingFolderName = '';
  confirmingDeleteFolderId: number | null = null;
  showMoveMenu: number | null = null; // 顯示移動選單的 tripId

  get currentFolderName(): string {
    if (this.currentFolderId === null) return '';
    return this.folders.find(f => f.id === this.currentFolderId)?.name ?? '';
  }

  get filteredTrips(): TripSummary[] {
    return this.trips.filter(t => t.folderId === this.currentFolderId);
  }

  get unclassifiedCount(): number {
    return this.trips.filter(t => t.folderId === null || t.folderId === undefined).length;
  }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.showLoginRequired = true;
      this.ngZone.runOutsideAngular(() => {
        const timer = setInterval(() => {
          this.countdown--;
          const el = this.el.nativeElement.querySelector('#countdown-text');
          if (el) el.textContent = `${this.countdown} 秒後自動跳轉至登入頁面`;
          if (this.countdown === 0) {
            clearInterval(timer);
            this.ngZone.run(() => this.router.navigate(['/login']));
          }
        }, 1000);
      });
      return;
    }
    this.loadAll();
  }

  loadAll() {
    this.isLoading = true;
    this.tripService.getFolders().subscribe({
      next: (res) => {
        if (res.success) this.folders = res.data;
      }
    });
    this.tripService.getFavorites().subscribe({
      next: (res) => {
        if (res.success) this.trips = res.data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  enterFolder(folderId: number) {
    this.currentFolderId = folderId;
  }

  goBack() {
    this.currentFolderId = null;
  }

  // 資料夾 CRUD
  createFolder() {
    if (!this.newFolderName.trim()) return;
    this.tripService.createFolder(this.newFolderName.trim()).subscribe({
      next: (res) => {
        if (res.success) {
          this.folders.push(res.data);
          this.newFolderName = '';
          this.showCreateFolder = false;
        }
      }
    });
  }

  startEditFolder(folder: TripFavoriteFolder, event: Event) {
    event.stopPropagation();
    this.editingFolderId = folder.id;
    this.editingFolderName = folder.name;
  }

  saveEditFolder(folder: TripFavoriteFolder) {
    if (!this.editingFolderName.trim()) return;
    this.tripService.updateFolder(folder.id, this.editingFolderName.trim()).subscribe({
      next: () => {
        folder.name = this.editingFolderName.trim();
        this.editingFolderId = null;
      }
    });
  }

  requestDeleteFolder(folderId: number, event: Event) {
    event.stopPropagation();
    this.confirmingDeleteFolderId = folderId;
  }

  confirmDeleteFolder() {
    if (!this.confirmingDeleteFolderId) return;
    this.tripService.deleteFolder(this.confirmingDeleteFolderId).subscribe({
      next: () => {
        this.folders = this.folders.filter(f => f.id !== this.confirmingDeleteFolderId);
        // 把該資料夾的收藏移到未分類
        this.trips.forEach(t => {
          if (t.folderId === this.confirmingDeleteFolderId) t.folderId = null;
        });
        this.confirmingDeleteFolderId = null;
      }
    });
  }

  // 移動收藏
  moveTo(trip: TripSummary, folderId: number | null, event: Event) {
    event.stopPropagation();
    const oldFolderId = trip.folderId ?? null;
    this.tripService.moveFavoriteToFolder(trip.id, folderId).subscribe({
      next: () => {
        // 更新舊資料夾的計數
        if (oldFolderId !== null) {
          const oldFolder = this.folders.find(f => f.id === oldFolderId);
          if (oldFolder) oldFolder.favoriteCount--;
        }
        // 更新新資料夾的計數
        if (folderId !== null) {
          const newFolder = this.folders.find(f => f.id === folderId);
          if (newFolder) newFolder.favoriteCount++;
        }
        trip.folderId = folderId;
        this.showMoveMenu = null;
      }
    });
  }

  toggleMoveMenu(tripId: number, event: Event) {
    event.stopPropagation();
    this.showMoveMenu = this.showMoveMenu === tripId ? null : tripId;
  }

  // 取消收藏
  removeFavorite(trip: TripSummary, event: Event) {
    event.stopPropagation();
    this.tripService.removeFavorite(trip.id).subscribe({
      next: () => {
        this.trips = this.trips.filter(t => t.id !== trip.id);
        this.confirmingRemoveId = null;
      }
    });
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      active: '揪團中', locked: '即將成行', completed: '已結束', cancelled: '已取消'
    };
    return map[status] ?? status;
  }

  getStatusBadgeClass(status: string): string {
    const map: Record<string, string> = {
      active: 'badge-success', locked: 'badge-warning',
      completed: 'badge-ghost', cancelled: 'badge-error'
    };
    return map[status] ?? 'badge-ghost';
  }

  getTripTypeLabel(type: string): string {
    const map: Record<string, string> = {
      surf: '🏄 衝浪', dive: '⚓ 深潛', snorkel: '🤿 浮潛',
      kayak: '🚣 獨木舟', sailing: '⛵ 帆船', sup: '🏄 SUP 立槳', other: '🌊 其他'
    };
    return map[type] ?? type;
  }
}
