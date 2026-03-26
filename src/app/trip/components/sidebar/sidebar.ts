import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

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

  constructor(private router: Router) { }

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

  toggle() {
    this.isCollapsed = !this.isCollapsed;
    // 儲存狀態到 localStorage
    localStorage.setItem('sidebarCollapsed', String(this.isCollapsed));
  }
}
