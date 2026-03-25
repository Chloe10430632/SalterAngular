import { Injectable } from '@angular/core';
import { PostInteractionsService } from './post-interactions-service';
import { BoardInteractionsService } from './board-interactions-service';
import { BoardDetails } from '../interfaces/boardDetails';
import { BoardInteractionsRequest } from '../interfaces/boardInteractionsRequest';
import { CurrentUser } from '../interfaces/currentUser';
import { PostList } from '../interfaces/postList';
import { ToastrService } from 'ngx-toastr';
import { PostInteractionsRequest } from '../interfaces/postInteractionsRequest';

@Injectable({
  providedIn: 'root',
})
export class HandleInteractions {
  /**當前環境網址根目錄 */
  readonly domain = window.location.origin;

  constructor(
    private postInteractionsService: PostInteractionsService,
    private boardInteractionsService: BoardInteractionsService,
    private toastr: ToastrService,
  ) { }

  /**看板互動 */
  interactWithBoard(board: BoardDetails, type: string, currentUser?: CurrentUser) {
    if (type === 'follow') {
      board.isFollowed = !board.isFollowed;
    }

    const request: BoardInteractionsRequest = {
      boardId: board.boardId,
      type: type as 'follow' | 'view',
    };

    if (!currentUser) return;
    this.boardInteractionsService.postBoardInteractionsApi(request).subscribe({
      next: (data) => {
      },
      error: (err) => {
        console.error(`interaction failed`, err);
      }
    });
  }

  /**貼文互動 */
  interactWithPost(post: PostList, type: string, reason?: string, currentUser?: CurrentUser) {
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
      this.copyPostToClipboard(post.postId);
    }

    const request: PostInteractionsRequest = {
      postId: post.postId,
      type: type as 'like' | 'collect' | 'share' | 'report' | 'view',
      reportReason: type === 'report' ? reason : undefined,
    };

    if (!currentUser) return;

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

      }
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
}
