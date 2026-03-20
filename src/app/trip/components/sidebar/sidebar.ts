import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {
  isCollapsed = false;
  isInitialized = false;

  constructor(private router: Router) { }

  ngOnInit() {
    // 從 localStorage 讀取上次的狀態
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) {
      this.isCollapsed = saved === 'true';
    }
  }

  get isDetailPage(): boolean {
    return this.router.url.includes('/trip/detail');
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
    // 儲存狀態到 localStorage
    localStorage.setItem('sidebarCollapsed', String(this.isCollapsed));
  }
}
