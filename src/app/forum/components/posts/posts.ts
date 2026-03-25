
import { PostList } from './../../interfaces/postList';
import { DecimalPipe } from '@angular/common';
import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { PostsService } from '../../services/posts-service';
import { RelativeTimePipe } from '../../pipes/relative-time-pipe';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Router, RouterLink } from '@angular/router';
import { PostInteractionsService } from '../../services/post-interactions-service';
import { PostInteractionsRequest } from '../../interfaces/postInteractionsRequest';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth-service';
import { CurrentUser } from '../../interfaces/currentUser';
import { environment } from './../../../../environments/environment';


@Component({
  selector: 'app-posts',
  imports: [DecimalPipe, RelativeTimePipe, InfiniteScrollDirective, RouterLink],
  templateUrl: './posts.html',
  styleUrl: './posts.css',
})
export class Posts implements OnInit {

  /**當前環境網址根目錄 */
  readonly domain = window.location.origin;

  /**目前使用者 */
  currentUser?: CurrentUser;

  /**貼文篩選變數，預設為popular */
  activeTab: 'popular' | 'new' | 'follow' = 'popular';

  /**後端伺服器PORT */
  backendServer = `${environment.domain}`;

  /**裝Api打回來的貼文資料 */
  postList: PostList[] = [];

  /**還在打Api */
  isLoading = false;

  /**是否已沒有更多資料 */
  isFinished = false;

  /**用來記錄現在是哪篇貼文要被檢舉*/
  selectedPostForReport?: PostList;

  /**儲存目前要放大顯示的圖片網址 */
  selectedFullImage = signal<string | null>(null);

  //-------刪除貼文-----------
  // 取得刪除的 Modal 元素
  @ViewChild('deleteModal') deleteModal!: ElementRef<HTMLDialogElement>;

  // 暫存準備刪除的 ID
  private pendingDeletePostId?: number;



  constructor(
    private postsService: PostsService,
    private postInteractionsService: PostInteractionsService,
    private toastr: ToastrService,
    public authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.loadMore('popular');
    this.authService.currentUser$.subscribe(data => {
      this.currentUser = data;
    });
  }

  // 無限滾動被動載入資料
  onScroll() {
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

  //不同篩選條件執行分頁邏輯
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

  /**刪除貼文 */

  //互動呼叫Api
  handleInteraction(post: PostList, type: string, reason?: string) {
    if (type === 'like') {
      post.isLiked = !post.isLiked;
      if (post.isLiked) {
        post.likeCount++;
      } else {
        post.likeCount--;
      }

    } else if (type === 'collect') {
      post.isCollected = !post.isCollected;
      if (post.isCollected) {
        post.collectCount++;
      } else {
        post.collectCount--;
      }
    } else if (type === 'share') {
      post.shareCount++;
      this.copyToClipboard(post.postId);
    }

    const request: PostInteractionsRequest = {
      postId: post.postId,
      type: type as 'like' | 'collect' | 'share' | 'report' | 'view',
      reportReason: type === 'report' ? reason : undefined,
    };

    if (!this.currentUser) return;

    this.postInteractionsService.postPostInteractionsApi(request).subscribe({
      next: (data) => {
        if (type === 'report') {
          this.toastr.info(
            '',
            '我們已收到您的檢舉，將會盡快處理。'
          );
        }
      },


      error: (err) => {
        console.error(`interaction failed`, err);
      }
    });

  }

  //複製貼文網址
  copyToClipboard(postId: number) {
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

  // 打開檢舉彈窗
  openReportModal(post: PostList) {
    this.selectedPostForReport = post;
    console.log(this.selectedPostForReport);
    const modal = document.getElementById('report_modal') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }

  // 確認送出檢舉
  confirmReport(post: any, reason: string, detail: string) {
    if (reason === '請選擇原因') {
      this.toastr.warning('請先選擇檢舉原因', '提示');
      return;
    }

    reason = `${reason}:${detail}`;
    this.handleInteraction(post, 'report', reason);
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




  /**打開刪除貼文彈窗 */
  openDeleteModal(postId: number) {
    this.pendingDeletePostId = postId;
    this.deleteModal.nativeElement.showModal();
  }

  /**關閉刪除貼文彈窗 */
  closeDeleteModal() {
    this.deleteModal.nativeElement.close();
    this.pendingDeletePostId = undefined;
  }

  /**送出刪除貼文 */
  deletePost() {
    if (!this.pendingDeletePostId) return;
    this.postsService.delDeletePost(this.pendingDeletePostId).subscribe({
      next: (res) => {
        this.toastr.info('您的貼文已刪除！');

        //重新渲染畫面
        this.onTabChange(this.activeTab);
        this.loadMore(this.activeTab);
      }
    });
  }

}
