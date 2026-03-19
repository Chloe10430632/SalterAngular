import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core'; //跑回圈和判斷式用

@Component({
  selector: 'app-coach-card',
  imports: [CommonModule],
  templateUrl: './coach-card.html',
  styleUrl: './coach-card.css',
})
export class CoachCard {

  //跟DTO欄位名字要一樣
  @Input() coachData!: {
    coachId: number;
    coachName: string;
    avatarUrl: string | null;
    district: (string | null)[];
    avgRating: number;
    reviewCount: number;
    specialities: string[];
    createdAt?: Date | null;
  };
  /**收藏開關*/

}
