import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
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
