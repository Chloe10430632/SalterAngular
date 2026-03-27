import { Component } from '@angular/core';
import { Header } from '../../header/header';
import { Main } from '../../main/main';
import { Router } from '@angular/router';
import { NotificationService } from '../../notifyService/notification-service';
import { CommonModule, NgClass } from '@angular/common';
import { Footer } from "../../footer/footer";

@Component({
  selector: 'app-member-center-layout',
  imports: [Header, Main, NgClass, CommonModule, Footer],
  templateUrl: './member-center-layout.html',
  styleUrl: './member-center-layout.css',
})
export class MemberCenterLayout {
  constructor(public router: Router, public notify: NotificationService) { }
}
