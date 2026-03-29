import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core'; //跑回圈和判斷式用
import { Router } from '@angular/router';

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
   private route = inject(Router)
  isFavorite = false;

   toggleFavorite() {
    this.isFavorite = !this.isFavorite;
    // 這裡可以加入 API 呼叫邏輯
  }

  intro(){
    this.route.navigate(['/experience/coachintro'])
  }

    // 模擬數據
  reviews = [
    { userId: 'User_Alex99', stars: 5, comment: '老師教學非常細心，動作講解的很清楚！' },
    { userId: 'FitnessLover', stars: 4, comment: '課程強度適中，非常有收穫。' },
    { userId: 'HealthyLife', stars: 5, comment: '非常有耐心的教練，推推！' }
  ];

  // 計算平均分數 (取至小數點第一位)
  get averageRating(): number {
    const total = this.reviews.reduce((sum, review) => sum + review.stars, 0);
    return Math.round((total / this.reviews.length) * 10) / 10;
  }

  // 取得評論總數
  get totalReviews(): number {
    return this.reviews.length;
  }

  courses = [
    { id: 1, title: '晨間舒活瑜珈', desc: '適合上班族的伸展練習...', image: 'https://picsum.photos/id/101/400/250' },
    { id: 2, title: '核心基礎核心', desc: '建立強健的體幹基礎...', image: 'https://picsum.photos/id/102/400/250' }
  ];


}
