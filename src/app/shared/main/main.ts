import { Component } from '@angular/core';
import { Index } from '../../forum/components/index/index';
import { RouterOutlet } from "@angular/router";


@Component({
  selector: 'app-main',
  imports: [Index, RouterOutlet],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {

}
