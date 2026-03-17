import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  isCollapsed = false;

  constructor(private router: Router) { }

  get isDetailPage(): boolean {
    return this.router.url.includes('/trip/detail');
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
  }
}
