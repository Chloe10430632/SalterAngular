import { Component, Input } from '@angular/core';
import { ReviewI } from '../../../Interfaces/IIreview';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../../../Service/auth-store';
import { AvatarPipe } from '../../../../shared/pipes/avatar-pipe';
import { FormsModule } from '@angular/forms';
import { CourseOrderI } from '../../../Interfaces/IIOrder';
import { ReviewsS } from '../../../Service/reviews';
import { NotificationService } from '../../../../shared/notifyService/notification-service';
//================!! 子 元件!!==============================//
//================學生單則評論==================================//


@Component({
  selector: 'app-memreview-card',
  imports: [CommonModule, AvatarPipe, FormsModule],
  templateUrl: './memreview-card.html',
  styleUrl: './memreview-card.css',
})
export class MemreviewCard {
  @Input() data!: ReviewI
  getStars(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }
}

