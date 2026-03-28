import { Component, OnInit, inject, NgZone, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';
import { TripService } from '../../services/trip';
import { TripSummary } from '../../interfaces/trip';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-my-trips',
  imports: [DatePipe, NgClass, RouterLink],
  templateUrl: './my-trips.html',
  styleUrl: './my-trips.css'
})
export class MyTrips implements OnInit {

  private tripService = inject(TripService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private el = inject(ElementRef);

  trips: TripSummary[] = [];
  isLoading = true;
  viewMode: 'list' | 'calendar' = 'list';
  roleFilter: 'all' | 'organizer' | 'member' = 'all';

  showLoginRequired = false;
  countdown = 6;

  // 日曆
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth(); // 0-11
  calendarDays: { date: Date; trips: TripSummary[] }[] = [];

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
            this.ngZone.run(() => {
              this.router.navigate(['/login']);
            });
          }
        }, 1000);
      });
      return;
    }

    this.authService.currentUser$.subscribe(user => {
      if (user) this.loadTrips();
    });
  }

  loadTrips() {
    this.isLoading = true;
    const role = this.roleFilter === 'all' ? undefined : this.roleFilter;
    this.tripService.getMyTrips(role).subscribe({
      next: (res) => {
        if (res.success) {
          this.trips = res.data;
          this.buildCalendar();
        }
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  setRoleFilter(role: 'all' | 'organizer' | 'member') {
    this.roleFilter = role;
    this.loadTrips();
  }

  setViewMode(mode: 'list' | 'calendar') {
    this.viewMode = mode;
    if (mode === 'calendar') this.buildCalendar();
  }

  // ── 日曆 ──
  get currentMonthLabel(): string {
    return new Date(this.currentYear, this.currentMonth).toLocaleDateString('zh-TW', {
      year: 'numeric', month: 'long'
    });
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.buildCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.buildCalendar();
  }

  buildCalendar() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const days: { date: Date; trips: TripSummary[] }[] = [];

    // 補前面空格
    for (let i = 0; i < firstDay.getDay(); i++) {
      const d = new Date(firstDay);
      d.setDate(d.getDate() - (firstDay.getDay() - i));
      days.push({ date: d, trips: [] });
    }

    // 當月日期
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(this.currentYear, this.currentMonth, d);
      const tripsOnDay = this.trips.filter(t => {
        const start = new Date(t.startAt);
        const end = t.endAt ? new Date(t.endAt) : start;
        return date >= new Date(start.getFullYear(), start.getMonth(), start.getDate()) &&
          date <= new Date(end.getFullYear(), end.getMonth(), end.getDate());
      });
      days.push({ date, trips: tripsOnDay });
    }

    // 補後面空格到 42 格
    while (days.length < 42) {
      const last = days[days.length - 1].date;
      const next = new Date(last);
      next.setDate(next.getDate() + 1);
      days.push({ date: next, trips: [] });
    }

    this.calendarDays = days;
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentMonth && date.getFullYear() === this.currentYear;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
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
      surf: '🏄 衝浪', dive: '⚓ 深潛', snorkel: '🤿 浮潛',
      kayak: '🚣 獨木舟', sailing: '⛵ 帆船', sup: '🏄 SUP 立槳', other: '🌊 其他'
    };
    return map[type] ?? type;
  }
}
