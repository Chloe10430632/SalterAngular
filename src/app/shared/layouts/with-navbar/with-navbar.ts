import { Component } from '@angular/core';
import { Header } from "../../header/header";
import { Main } from "../../main/main";
import { CommonModule, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../../notifyService/notification-service';

@Component({
  selector: 'app-with-navbar',
  imports: [Header, Main, NgClass, CommonModule],
  templateUrl: './with-navbar.html',
  styleUrl: './with-navbar.css',
})
export class WithNavbar {
  constructor(public router: Router, public notify: NotificationService) { }
}
