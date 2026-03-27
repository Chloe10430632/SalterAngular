import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-noavatar',
  imports: [],
  templateUrl: './noavatar.html',
  styleUrl: './noavatar.css',
})
export class Noavatar {
  @Input() title = "Title";
}
