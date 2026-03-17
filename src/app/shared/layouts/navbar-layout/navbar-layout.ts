import { Component } from '@angular/core';
import { Main } from '../../main/main';
import { Header } from '../../header/header';

@Component({
  selector: 'app-navbar-layout',
  imports: [Main, Header],
  templateUrl: './navbar-layout.html',
  styleUrl: './navbar-layout.css',
})
export class NavbarLayout {

}
