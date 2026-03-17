import { Component } from '@angular/core';
import { Header } from "../../header/header";
import { Main } from "../../main/main";

@Component({
  selector: 'app-with-navbar',
  imports: [Header, Main],
  templateUrl: './with-navbar.html',
  styleUrl: './with-navbar.css',
})
export class WithNavbar {

}
