import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AttendCourseCard } from "../../myComponents/card/coach-course-card/coach-course-card";
import { MemreviewCard } from "../../myComponents/card/memreview-card/memreview-card";

@Component({
  selector: 'app-coachintro',
  imports: [RouterLink, AttendCourseCard, MemreviewCard],
  templateUrl: './coach-intro.html',
  styleUrl: './coach-intro.css',
})
export class Coachintro {
  isFavorite = false;
   toggleFavorite() {
    this.isFavorite = !this.isFavorite;
    // 這裡可以加入 API 呼叫邏輯
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
