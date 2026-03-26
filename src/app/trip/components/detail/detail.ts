import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgClass } from '@angular/common';
import { TripService } from '../../services/trip';
import { TripDetail, TripMember } from '../../interfaces/trip';
import { NotificationService } from '../../../shared/notifyService/notification-service';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-detail',
  imports: [FormsModule, DatePipe, NgClass, RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.css'
})
export class Detail implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tripService = inject(TripService);
  private notify = inject(NotificationService);
  private authService = inject(AuthService);


  tripId = 0;
  trip: TripDetail | null = null;
  isLoading = true;
  activeTab = 'intro';

  // 目前登入者
  currentUserId = 0;
  currentUserPicture = '';
  currentUserName = '';
  isMember = false;
  isOrganizer = false;
  isFavorite = false;
  isJoining = false;
  isLeaving = false;
  showExitModal = false;


  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUserId = user?.id ?? 0;
      this.currentUserPicture = user?.picture ?? '';
      this.currentUserName = user?.name ?? '';
      if (this.trip) this.checkMembership();
    });

    this.route.params.subscribe(params => {
      this.tripId = +params['id'];
      this.loadTrip();
    });
  }


  loadTrip() {
    this.isLoading = true;
    this.tripService.getTripById(this.tripId).subscribe({
      next: (res) => {
        if (res.success) {
          this.trip = res.data;
          this.isFavorite = this.trip.isFavorite ?? false;
          this.checkMembership();
        }
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  checkMembership() {
    if (!this.trip) return;
    this.isOrganizer = this.trip.organizerUserId === this.currentUserId;
    this.isMember = this.isOrganizer || this.trip.members.some(m => m.userId === this.currentUserId);
  }

  joinTrip() {
    if (!this.currentUserId) {
      this.notify.show('請先登入才能加入行程', 'error');
      return;
    }
    this.isJoining = true;
    this.tripService.joinTrip(this.tripId).subscribe({
      next: () => {
        this.notify.show('成功加入行程！', 'success');
        this.loadTrip();
        this.isJoining = false;
      },
      error: () => this.isJoining = false
    });
  }

  leaveTrip() {
    this.isLeaving = true;
    this.tripService.leaveTrip(this.tripId).subscribe({
      next: () => {
        this.notify.show('已退出行程', 'success');
        this.showExitModal = false;
        this.loadTrip();
        this.isLeaving = false;
      },
      error: () => this.isLeaving = false
    });
  }

  toggleFavorite() {
    if (!this.currentUserId) {
      this.notify.show('請先登入才能收藏', 'error');
      return;
    }
    if (this.isFavorite) {
      this.tripService.removeFavorite(this.tripId).subscribe({
        next: () => { this.isFavorite = false; }
      });
    } else {
      this.tripService.addFavorite(this.tripId).subscribe({
        next: () => { this.isFavorite = true; }
      });
    }
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      active: '揪團中', locked: '即將成行', completed: '已結束', cancelled: '已取消'
    };
    return map[status] ?? status;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      active: 'badge-success', locked: 'badge-warning',
      completed: 'badge-ghost', cancelled: 'badge-error'
    };
    return map[status] ?? 'badge-ghost';
  }

  getTripTypeLabel(type: string): string {
    const map: Record<string, string> = {
      surf: '🏄 衝浪', dive: '🤿 深潛', snorkel: '🤿 浮潛',
      kayak: '🚣 獨木舟', sailing: '⛵ 帆船', sup: '🏄 SUP 立槳', other: '🌊 其他'
    };
    return map[type] ?? type;
  }

  getInitial(name: string): string {
    return name?.charAt(0)?.toUpperCase() ?? '?';
  }

  get memberProgress(): number {
    if (!this.trip) return 0;
    return Math.round((this.trip.memberCount / this.trip.capacity) * 100);
  }

  get remainingSlots(): number {
    if (!this.trip) return 0;
    return this.trip.capacity - this.trip.memberCount;
  }
}
