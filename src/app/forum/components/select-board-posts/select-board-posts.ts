import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RelativeTimePipe } from '../../pipes/relative-time-pipe';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { PostList } from '../../interfaces/postList';
import { PostsService } from '../../services/posts-service';
import { BoardsService } from '../../services/boards-service';
import { BoardDetails } from '../../interfaces/boardDetails';

@Component({
  selector: 'app-select-board-posts',
  imports: [DecimalPipe, RelativeTimePipe, InfiniteScrollDirective, RouterLink],
  templateUrl: './select-board-posts.html',
  styleUrl: './select-board-posts.css',
})
export class SelectBoardPosts implements OnInit {

  /**按讚變數 */
  isLiked = false;
  likeCount = 8867;
  /**收藏變數 */
  isBookmarked = false;
  bookmarkCount = 102;

  /**看板詳細資料 */
  boardDetails?: BoardDetails;

  /**後端伺服器PORT */
  backendServer = "https://localhost:7017";

  /**裝Api打回來的貼文資料 */
  postList: PostList[] = [];

  /**還在打Api */
  isLoading = false;

  /**是否已沒有更多資料 */
  isFinished = false;

  /**目前選中的看板ID */
  boardId: number | null = null;

  constructor(private postsService: PostsService, private boardsService: BoardsService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {


    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.boardId = +id; // 使用 + 號快速轉成 number
        this.boardsService.GetBoardByIdApi(this.boardId).subscribe(data => {
          this.boardDetails = data;
        });
        this.reset();
        this.loadMore();
      }
    });


  }

  reset() {
    this.postList = [];
    this.isFinished = false;
    this.isLoading = false;
  }

  // 無限滾動被動載入資料
  onScroll() {
    this.loadMore();
  }



  loadMore() {
    if (this.isLoading || this.isFinished) return;
    this.isLoading = true;
    const lastPost = this.postList[this.postList.length - 1];

    this.postsService.GetBoardPostsApi(this.boardId!, lastPost?.viewCount, lastPost?.postId)
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




  /**貼文互動邏輯待修改 */
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






