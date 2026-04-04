import { Component, Input } from '@angular/core';
import { ReviewI } from '../../../Interfaces/IIreview';
//================!! 子 元件!!==============================//
//================學生單則評論==================================//


@Component({
  selector: 'app-memreview-card',
  imports: [],
  templateUrl: './memreview-card.html',
  styleUrl: './memreview-card.css',
})
export class MemreviewCard {
 @Input() data!: ReviewI
}
