
import { PostList } from './../../interfaces/postList';
import { DecimalPipe } from '@angular/common';
import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { PostsService } from '../../services/posts-service';
import { RelativeTimePipe } from '../../pipes/relative-time-pipe';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth-service';
import { CurrentUser } from '../../interfaces/currentUser';
import { Observable } from 'rxjs';
import { HandleInteractions } from '../../services/handle-interactions';
import { AvatarPipe } from "../../../shared/pipes/avatar-pipe";
import { NotificationService } from '../../../shared/notifyService/notification-service';

@Component({
  selector: 'app-posts',
  imports: [DecimalPipe, RelativeTimePipe, InfiniteScrollDirective, RouterLink, AvatarPipe],
  templateUrl: './posts.html',
  styleUrl: './posts.css',
})

export class Posts implements OnInit {

  /**當前環境網址根目錄 */
  readonly domain = window.location.origin;

  /**目前使用者 */
  currentUser?: CurrentUser;

  /**貼文排序篩選條件 */
  queryPara?: 'popular' | 'new' | 'follow';

  /**貼文關鍵字搜尋 */
  currentKeyword: string = '';

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

  /**取得刪除的 Modal 元素 */
  @ViewChild('deleteModal') deleteModal!: ElementRef<HTMLDialogElement>;

  /**暫存準備刪除的貼文ID */
  private pendingDeletePostId?: number;

  constructor(
    private postsService: PostsService,
    private handleInteractionsService: HandleInteractions,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public authService: AuthService,
    private router: Router,
    private n: NotificationService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.currentKeyword = params['keyword'] ?? '';
      this.queryPara = params['sortBy'] ?? 'popular';
      this.resetAndLoad();
    });

    this.authService.currentUser$.subscribe(data => {
      this.currentUser = data;
    });
  }

  /**切換貼文排序重置 */
  private resetAndLoad() {
    this.postList = [];
    this.isFinished = false;
    this.isLoading = false;
    this.loadMore();
  }

  /**不同篩選條件執行分頁邏輯 */
  loadMore() {
    if (this.isLoading || this.isFinished) return;
    this.isLoading = true;
    const lastPost = this.postList[this.postList.length - 1];

    let apiCall$: Observable<PostList[]>;

    // --- 第一步：決定資料來源 (Strategy Pattern) ---
    if (this.currentKeyword) {
      apiCall$ = this.postsService.GetKeywordPostApi(this.currentKeyword, lastPost?.viewCount, lastPost?.postId);
    } else {
      switch (this.queryPara) {
        case 'new':
          apiCall$ = this.postsService.GetNewPostsApi(lastPost?.createdAt, lastPost?.postId);
          break;
        case 'follow':
          apiCall$ = this.postsService.GetFollowPostsApi(lastPost?.createdAt, lastPost?.postId);
          break;
        case 'popular':
        default:
          apiCall$ = this.postsService.GetPopPostsApi(lastPost?.viewCount, lastPost?.postId);
          break;
      }
    }

    // --- 第二步：統一處理後續邏輯 ---
    apiCall$.subscribe({
      next: (newPosts) => {
        if (!newPosts || newPosts.length === 0) {
          this.isFinished = true;
        } else {
          console.log('載入成功：', newPosts);
          this.postList = [...this.postList, ...newPosts];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('載入失敗', err);
        this.isLoading = false;
      }
    });
  }

  /**互動呼叫Api*/
  handleInteraction(post: PostList, type: string, reason?: string) {
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

  /**複製貼文網址 */
  copyToClipboard(postId: number) {
    const fullUrl = `${this.domain}/forum/posts/${postId}`;
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

  //-----------貼文檢舉相關-----------

  /**打開檢舉彈窗 */
  openReportModal(post: PostList) {
    this.selectedPostForReport = post;
    console.log(this.selectedPostForReport);
    const modal = document.getElementById('report_modal') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }

  /**確認送出檢舉 */
  confirmReport(post: any, reason: string, detail: string) {
    if (!this.currentUser) {
      this.n.show("欲檢舉貼文，請先登入。", "error");
      return;
    }

    if (reason === '請選擇原因') {
      this.n.show('請先選擇檢舉原因', 'error');
      return;
    }

    reason = `${reason}:${detail}`;
    this.handleInteraction(post, 'report', reason);
  }

  //-----------圖片預覽相關-----------

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
    this.router.navigate(['/forum/posts', postId]);
  }


  //-----------貼文刪除相關-----------

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
        this.resetAndLoad();
      }
    });
  }

}
