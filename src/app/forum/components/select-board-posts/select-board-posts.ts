import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RelativeTimePipe } from '../../pipes/relative-time-pipe';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { PostList } from '../../interfaces/postList';
import { PostsService } from '../../services/posts-service';
import { BoardsService } from '../../services/boards-service';
import { BoardDetails } from '../../interfaces/boardDetails';
import { ToastrService } from 'ngx-toastr';
import { PostInteractionsRequest } from '../../interfaces/postInteractionsRequest';
import { PostInteractionsService } from '../../services/post-interactions-service';
import { BoardInteractionsRequest } from '../../interfaces/boardInteractionsRequest';
import { CurrentUser } from '../../interfaces/currentUser';
import { AuthService } from '../../../core/services/auth-service';
import { BoardInteractionsService } from '../../services/board-interactions-service';
import { environment } from './../../../../environments/environment';
import { HandleInteractions } from '../../services/handle-interactions';

@Component({
  selector: 'app-select-board-posts',
  imports: [DecimalPipe, RelativeTimePipe, InfiniteScrollDirective, RouterLink],
  templateUrl: './select-board-posts.html',
  styleUrl: './select-board-posts.css',
})
export class SelectBoardPosts implements OnInit {

  /**目前使用者 */
  currentUser?: CurrentUser;

  /**當前環境網址根目錄 */
  readonly domain = window.location.origin;

  /**後端伺服器PORT */
  backendServer = `${environment.domain}`;

  /**看板詳細資料 */
  boardDetails?: BoardDetails;

  /**裝Api打回來的貼文資料 */
  postList: PostList[] = [];

  /**還在打Api */
  isLoading = false;

  /**是否已沒有更多資料 */
  isFinished = false;

  /**目前選中的看板ID */
  boardId: number | null = null;

  /**用來記錄現在是哪篇貼文要被檢舉*/
  selectedPostForReport?: PostList;

  /**儲存目前要放大顯示的圖片網址 */
  selectedFullImage = signal<string | null>(null);

  constructor(
    private postsService: PostsService,
    private boardsService: BoardsService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private authService: AuthService,
    private handleInteractionsService: HandleInteractions,
    private postInteractionsService: PostInteractionsService,
    private boardInteractionsService: BoardInteractionsService,
    private router: Router) { }

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

    this.authService.currentUser$.subscribe(data => {
      this.currentUser = data;
    });


  }

  /**清空舊貼文資料 */
  reset() {
    this.postList = [];
    this.isFinished = false;
    this.isLoading = false;
  }

  /**無限滾動被動載入資料 */
  onScroll() {
    this.loadMore();
  }

  /**貼文分頁 */
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

  /**看板互動Api */
  handleBoardInteraction(board: BoardDetails, type: string) {
    switch (type) {
      case 'view':
        this.handleInteractionsService.interactWithBoard(board, 'view', this.currentUser)?.subscribe(data => {
          this.boardsService.GetBoardByIdApi(this.boardId!).subscribe(data => {
            this.boardDetails = data;
          });
        });
        break;
      case 'follow':
        this.handleInteractionsService.interactWithBoard(board, 'follow', this.currentUser)?.subscribe(data => {
          this.boardsService.GetBoardByIdApi(this.boardId!).subscribe(data => {
            this.boardDetails = data;
          });
        });
        break;
    }
  }

  /**貼文互動Api */
  handlePostInteraction(post: PostList, type: string, reason?: string) {
    switch (type) {
      case 'view':
        this.handleInteractionsService.interactWithPost(post, 'view', undefined, this.currentUser)?.subscribe();
        break;
      case 'like':
        this.handleInteractionsService.interactWithPost(post, 'like', undefined, this.currentUser)?.subscribe();
        break;
      case 'share':
        this.handleInteractionsService.interactWithPost(post, 'share', undefined, this.currentUser)?.subscribe();
        break;
      case 'collect':
        this.handleInteractionsService.interactWithPost(post, 'collect', undefined, this.currentUser)?.subscribe();
        break;
      case 'report':
        this.handleInteractionsService.interactWithPost(post, 'report', reason, this.currentUser)?.subscribe(data => {
          this.toastr.info(
            '',
            '我們已收到您的檢舉，將會盡快處理。'
          );
        });
        break;
    }
  }

  /**複製看板網址 */
  copyBoardToClipboard(boardId: number) {
    const fullUrl = `${this.domain}/forum/boards/${boardId}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      this.toastr.info('', '網址成功複製到剪貼簿！', {
        toastClass: 'ngx-toastr shadow-xl rounded-2xl border-none',
      });
    }).catch(err => {
      this.toastr.info('', '無法複製連結', {
        toastClass: 'ngx-toastr shadow-xl rounded-2xl border-none',
      });
    });
  }

  /**複製貼文網址 */
  copyPostToClipboard(postId: number) {
    // 建立完整的 URL (根據你的環境調整)
    const fullUrl = `${this.domain}/post/${postId}`;

    navigator.clipboard.writeText(fullUrl).then(() => {

      this.toastr.info('', '成功複製到剪貼簿！', {
        toastClass: 'ngx-toastr shadow-xl rounded-2xl border-none',
      });
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }).catch(err => {
      this.toastr.info('', '無法複製連結', {
        toastClass: 'ngx-toastr shadow-xl rounded-2xl border-none',
      });
    });
  }

  /**檢舉彈窗 */
  openReportModal(post: PostList) {
    this.selectedPostForReport = post;
    console.log(this.selectedPostForReport);
    const modal = document.getElementById('report_modal') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }

  /**確認送出檢舉單 */
  confirmReport(post: any, reason: string, detail: string) {
    if (reason === '請選擇原因') {
      this.toastr.warning('請先選擇檢舉原因', '提示');
      return;
    }

    reason = `${reason}:${detail}`;
    this.handlePostInteraction(post, 'report', reason);
  }

  /**放大圖片 - 開啟燈箱 */
  openLightbox(url: string) {
    this.selectedFullImage.set(url);
    const modal = document.getElementById('lightbox_modal') as HTMLDialogElement;
    modal?.showModal();
  }

  /**放大圖片 - 關閉燈箱 */
  closeLightbox() {
    this.selectedFullImage.set(null);
  }

  /**貼文導頁 */
  navigateToPost(event: Event, postId: number) {
    // 子元素的 stopPropagation 會阻止事件傳到這裡
    // 只有點擊卡片空白處、文字處，才會觸發這個導頁
    this.router.navigate(['/forum/posts', postId]);
  }
}






