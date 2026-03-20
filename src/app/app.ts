import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from "./shared/header/header";
import { Main } from './shared/main/main';
import { CommonModule, NgClass } from '@angular/common';
import { NotificationService } from './shared/notifyService/notification-service';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Main, NgClass, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Salter');

  constructor(public router: Router, public notify: NotificationService) { }
}
