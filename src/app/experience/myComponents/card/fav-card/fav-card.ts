import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fav-card',
  imports: [],
  templateUrl: './fav-card.html',
  styleUrl: './fav-card.css',
})
export class FavCard {
  isFavorite = false;
  reviewCount = 128;
  private route = inject(Router)


  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
    // 這裡可以加入 API 呼叫邏輯
  }

  onReviewClick() {
    console.log('導向評論頁面...');
  }

  intro(){
    this.route.navigate(['/experience/coachintro'])
  }
}
