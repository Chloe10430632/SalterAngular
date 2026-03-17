import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-posts',
  imports: [DecimalPipe],
  templateUrl: './posts.html',
  styleUrl: './posts.css',
})
export class Posts {

  isLiked = false;
  likeCount = 8867;

  isBookmarked = false;
  bookmarkCount = 102;

  toggleLike() {
    this.isLiked = !this.isLiked;
    // 邏輯處理：奇數次加1，偶數次減1
    this.isLiked ? this.likeCount++ : this.likeCount--;
  }

  toggleBookmark() {
    this.isBookmarked = !this.isBookmarked;
    this.isBookmarked ? this.bookmarkCount++ : this.bookmarkCount--;
  }


}
