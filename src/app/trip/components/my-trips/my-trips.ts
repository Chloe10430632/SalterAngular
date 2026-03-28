import { Component, OnInit, inject, NgZone, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';
import { TripService } from '../../services/trip';
import { TripSummary } from '../../interfaces/trip';
import { AuthService } from '../../../core/services/auth-service';

interface CalendarEvent {
  trip: TripSummary;
  startCol: number;
  span: number;
  row: number;
}

interface CalendarWeek {
  days: { date: Date; isCurrentMonth: boolean }[];
  events: CalendarEvent[];
}

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

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();
  calendarWeeks: CalendarWeek[] = [];

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

  get currentMonthLabel(): string {
    return new Date(this.currentYear, this.currentMonth).toLocaleDateString('zh-TW', {
      year: 'numeric', month: 'long'
    });
  }

  prevMonth() {
    if (this.currentMonth === 0) { this.currentMonth = 11; this.currentYear--; }
    else this.currentMonth--;
    this.buildCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) { this.currentMonth = 0; this.currentYear++; }
    else this.currentMonth++;
    this.buildCalendar();
  }

  buildCalendar() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);

    const allDays: { date: Date; isCurrentMonth: boolean }[] = [];
    for (let i = 0; i < firstDay.getDay(); i++) {
      const d = new Date(firstDay);
      d.setDate(d.getDate() - (firstDay.getDay() - i));
      allDays.push({ date: d, isCurrentMonth: false });
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      allDays.push({ date: new Date(this.currentYear, this.currentMonth, d), isCurrentMonth: true });
    }
    while (allDays.length < 42) {
      const last = allDays[allDays.length - 1].date;
      const next = new Date(last);
      next.setDate(next.getDate() + 1);
      allDays.push({ date: next, isCurrentMonth: false });
    }

    const weeks: CalendarWeek[] = [];
    for (let w = 0; w < 6; w++) {
      weeks.push({ days: allDays.slice(w * 7, w * 7 + 7), events: [] });
    }

    this.trips.forEach(trip => {
      const tripStart = new Date(trip.startAt);
      const tripEnd = trip.endAt ? new Date(trip.endAt) : new Date(trip.startAt);
      const s = new Date(tripStart.getFullYear(), tripStart.getMonth(), tripStart.getDate());
      const e = new Date(tripEnd.getFullYear(), tripEnd.getMonth(), tripEnd.getDate());

      weeks.forEach(week => {
        const weekStart = week.days[0].date;
        const weekEnd = week.days[6].date;
        if (e < weekStart || s > weekEnd) return;

        const startCol = Math.max(0, this.diffDays(weekStart, s));
        const endCol = Math.min(6, this.diffDays(weekStart, e));
        const span = endCol - startCol + 1;

        let row = 0;
        while (week.events.some(ev =>
          ev.row === row &&
          !(ev.startCol + ev.span - 1 < startCol || ev.startCol > endCol)
        )) { row++; }

        week.events.push({ trip, startCol, span, row });
      });
    });

    this.calendarWeeks = weeks;
  }

  diffDays(from: Date, to: Date): number {
    return Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
  }

  getEventStyle(event: CalendarEvent): string {
    const left = (event.startCol / 7) * 100;
    const width = (event.span / 7) * 100;
    const top = 28 + event.row * 22;
    return `left: calc(${left}% + 2px); width: calc(${width}% - 4px); top: ${top}px;`;
  }

  getEventColor(status: string): string {
    const map: Record<string, string> = {
      active: 'bg-primary text-primary-content',
      locked: 'bg-warning text-warning-content',
      completed: 'bg-neutral text-neutral-content',
      cancelled: 'bg-error text-error-content'
    };
    return map[status] ?? 'bg-primary text-primary-content';
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
