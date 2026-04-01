import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';
import { TripService } from '../../services/trip';
import { TripSummary } from '../../interfaces/trip';

@Component({
  selector: 'app-favorites',
  imports: [DatePipe, NgClass, RouterLink],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class Favorites implements OnInit {

  private tripService = inject(TripService);
  private router = inject(Router);

  trips: TripSummary[] = [];
  isLoading = true;

  confirmingRemoveId: number | null = null;

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.isLoading = true;
    this.tripService.getFavorites().subscribe({
      next: (res) => {
        if (res.success) this.trips = res.data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  removeFavorite(trip: TripSummary, event: Event) {
    event.stopPropagation();
    this.tripService.removeFavorite(trip.id).subscribe({
      next: () => {
        this.trips = this.trips.filter(t => t.id !== trip.id);
        this.confirmingRemoveId = null;
      }
    });
  }

  goToDetail(id: number) {
    this.router.navigate(['/trip/detail', id]);
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
