import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "../../header/header";
import { Footer } from "../../footer/footer";


@Component({
  selector: 'app-blank-layout',
  imports: [RouterOutlet, Header],
  templateUrl: './blank-layout.html',
  styleUrl: './blank-layout.css',
})
export class BlankLayout {

}
