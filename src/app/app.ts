import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from "./shared/header/header";
import { Main } from './shared/main/main';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Main],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Salter');

  constructor(public router: Router) { }
}
