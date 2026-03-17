import { Component, ViewEncapsulation } from '@angular/core';
import { Router, RouterOutlet, RouterLinkWithHref, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-index',
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive],
  templateUrl: './index.html',
  styleUrl: './index.css',
  encapsulation: ViewEncapsulation.None,
})
export class Index {

}
