import { PostList } from './../../interfaces/postList';
import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../services/posts-service';
import { RelativeTimePipe } from '../../pipes/relative-time-pipe';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-posts',
  imports: [DecimalPipe, RelativeTimePipe, InfiniteScrollDirective, RouterLink],
  templateUrl: './posts.html',
  styleUrl: './posts.css',
})
export class Posts implements OnInit {
  /**按讚變數 */
  isLiked = false;
  likeCount = 8867;
  /**收藏變數 */
  isBookmarked = false;
  bookmarkCount = 102;

  /**貼文篩選變數，預設為popular */
  activeTab: 'popular' | 'new' | 'follow' = 'popular';



  /**後端伺服器PORT */
  backendServer = "https://localhost:7017";

  /**裝Api打回來的貼文資料 */
  postList: PostList[] = [];

  /**還在打Api */
  isLoading = false;

  /**是否已沒有更多資料 */
  isFinished = false;


  constructor(private postsService: PostsService) { }

  ngOnInit(): void {
    this.loadMore('popular');
  }



  // 無限滾動被動載入資料
  onScroll() {
    // console.log('觸發捲動載入...');

    if (this.activeTab === 'popular') {
      this.loadMore('popular');
    }

    if (this.activeTab === 'new') {
      this.loadMore('new');
    }

    if (this.activeTab === 'follow') {
      this.loadMore('follow');
    }
  }



  // 點擊切換 Tab 的時候觸發
  onTabChange(tab: 'popular' | 'new' | 'follow') {
    this.activeTab = tab;
    // console.log('目前切換至：', this.activeTab);

    this.postList = [];
    this.isFinished = false;
    this.isLoading = false;

    this.loadMore(tab);
  }

  loadMore(tab: 'popular' | 'new' | 'follow') {
    if (this.isLoading || this.isFinished) return;
    this.isLoading = true;
    const lastPost = this.postList[this.postList.length - 1];

    if (this.activeTab === 'popular') {
      // 如果是第一次(lastPost 為 undefined)，Service會處理成不帶參數
      this.postsService.GetPopPostsApi(lastPost?.viewCount, lastPost?.postId)
        .subscribe({
          next: (newPosts) => {
            if (newPosts.length === 0) {
              this.isFinished = true;
            } else {
              console.log(newPosts);
              this.postList = [...this.postList, ...newPosts]; // 將新資料併入舊陣列
            }
            this.isLoading = false;
          },
          error: (err) => {
            console.error('載入失敗', err);
            this.isLoading = false;
          }
        });
    }

    if (this.activeTab === 'new') {
      this.postsService.GetNewPostsApi(lastPost?.createdAt, lastPost?.postId)
        .subscribe({
          next: (newPosts) => {
            if (newPosts.length === 0) {
              this.isFinished = true;
            } else {
              console.log(newPosts);
              this.postList = [...this.postList, ...newPosts]; // 將新資料併入舊陣列
            }
            this.isLoading = false;
          },
          error: (err) => {
            console.error('載入失敗', err);
            this.isLoading = false;
          }
        });
    }

    if (this.activeTab === 'follow') {
      this.postsService.GetFollowPostsApi(lastPost?.createdAt, lastPost?.postId)
        .subscribe({
          next: (newPosts) => {
            if (newPosts.length === 0) {
              this.isFinished = true;
            } else {
              console.log(newPosts);
              this.postList = [...this.postList, ...newPosts]; // 將新資料併入舊陣列
            }
            this.isLoading = false;
          },
          error: (err) => {
            console.error('載入失敗', err);
            this.isLoading = false;
          }
        });
    }

  }







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
