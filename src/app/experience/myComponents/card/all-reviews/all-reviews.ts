import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReviewI } from '../../../Interfaces/IIreview';
import { AvatarPipe } from '../../../../shared/pipes/avatar-pipe';

//這是Modal元件//
//跳出浮在前面的畫面//
//裝這個教練的所有評論//

@Component({
  selector: 'app-all-reviews',
  imports: [CommonModule, AvatarPipe],
  templateUrl: './all-reviews.html',
  styleUrl: './all-reviews.css',
})
export class AllReviews {
  @Input() reviews: ReviewI[] = [];
}
