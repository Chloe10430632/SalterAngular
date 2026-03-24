
import { Component, OnInit, signal } from '@angular/core';
import { PostDetailsData } from '../../interfaces/PostDetailsData';
import { PostsService } from '../../services/posts-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from './../../../../environments/environment';
import { RelativeTimePipe } from "../../pipes/relative-time-pipe";
import { DecimalPipe } from '@angular/common';
import { PostInteractionsRequest } from '../../interfaces/postInteractionsRequest';
import { CurrentUser } from '../../interfaces/currentUser';
import { AuthService } from '../../../core/services/auth-service';
import { PostInteractionsService } from '../../services/post-interactions-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-post-details',
  imports: [RouterLink, RelativeTimePipe, DecimalPipe,],
  templateUrl: './post-details.html',
  styleUrl: './post-details.css',
})
export class PostDetails implements OnInit {
  /**當前環境網址根目錄 */
  readonly domain = window.location.origin;

  /**目前使用者 */
  currentUser?: CurrentUser;

  /**貼文詳細資料 */
  postDetailsData?: PostDetailsData;

  /**後端伺服器PORT */
  backendServer = `${environment.domain}`;

  /**目前選中的貼文 */
  postId: number | null = null;

  /**儲存目前要放大顯示的圖片網址 */
  selectedFullImage = signal<string | null>(null);

  constructor(
    private postsService: PostsService,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private postInteractionsService: PostInteractionsService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.postId = +id;
        this.postsService.GetPostDetailsApi(this.postId).subscribe(data => {
          this.postDetailsData = data;
        });
      }
    });

    this.authService.currentUser$.subscribe(data => {
      this.currentUser = data;
    });

  }




  //互動呼叫Api
  handleInteraction(post: PostDetailsData, type: string, reason?: string) {
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
}
