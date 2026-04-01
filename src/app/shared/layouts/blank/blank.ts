import { Component } from '@angular/core';
import { Main } from "../../main/main";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-blank',
  imports: [Main, RouterOutlet],
  templateUrl: './blank.html',
  styleUrl: './blank.css',
})
export class Blank {

}
