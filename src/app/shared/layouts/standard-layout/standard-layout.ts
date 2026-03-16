import { Component } from '@angular/core';
import { Header } from '../../header/header';
import { Main } from '../../main/main';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-standard-layout',
  imports: [Header, Main, RouterOutlet/*,Footer*/],
  templateUrl: './standard-layout.html',
  styleUrl: './standard-layout.css',
})
export class StandardLayout {

}
