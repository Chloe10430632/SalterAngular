import { Component, Input } from '@angular/core';
import { ReviewI } from '../../../Interfaces/IIreview';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../../../Service/auth-store';
import { AvatarPipe } from '../../../../shared/pipes/avatar-pipe';
//================!! 子 元件!!==============================//
//================學生單則評論==================================//


@Component({
  selector: 'app-memreview-card',
  imports: [CommonModule,AvatarPipe],
  templateUrl: './memreview-card.html',
  styleUrl: './memreview-card.css',
})
export class MemreviewCard {
  @Input() data!: ReviewI
  constructor(private authS:AuthStore){}


  getStars(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }
}
