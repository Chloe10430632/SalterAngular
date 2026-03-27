import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { TripStateService } from '../../services/trip-state';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})


export class Sidebar implements OnInit {
  isCollapsed = false;
  isInitialized = false;
  tripId: number | null = null;

  private tripState = inject(TripStateService);
  private router = inject(Router);

  ngOnInit() {
    // 從 localStorage 讀取上次的狀態
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) {
      this.isCollapsed = saved === 'true';
    }
    this.extractTripId();
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      this.extractTripId();
    });
  }

  extractTripId() {
    const match = this.router.url.match(/\/trip\/detail\/(\d+)/);
    this.tripId = match ? +match[1] : null;
  }

  get isDetailPage(): boolean {
    return this.router.url.includes('/trip/detail');
  }

  get isLocationPage(): boolean {
    return this.router.url.includes('/trip/detail') && this.router.url.includes('/location');
  }

  get isTripMember(): boolean {
    return this.tripState.isMember();
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
    // 儲存狀態到 localStorage
    localStorage.setItem('sidebarCollapsed', String(this.isCollapsed));
  }
}
