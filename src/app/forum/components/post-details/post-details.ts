import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { PostComment, PostDetailsData } from '../../interfaces/PostDetailsData';
import { PostsService } from '../../services/posts-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RelativeTimePipe } from "../../pipes/relative-time-pipe";
import { DecimalPipe, ViewportScroller } from '@angular/common';
import { CurrentUser } from '../../interfaces/currentUser';
import { AuthService } from '../../../core/services/auth-service';
import { ToastrService } from 'ngx-toastr';
import { CreateCommentDto } from '../../interfaces/CreateCommentDto';
import { CommentsService } from '../../services/comments-service';
import { FormsModule } from '@angular/forms';
import { AvatarPipe } from "../../../shared/pipes/avatar-pipe";
import { HandleInteractions } from '../../services/handle-interactions';

@Component({
  selector: 'app-post-details',
  imports: [RouterLink, RelativeTimePipe, DecimalPipe, FormsModule, AvatarPipe],
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

  /**目前選中的貼文 */
  postId?: number;

  /**儲存目前留言回覆的對象 */
  replyStatus = {
    parentId: null as number | null,
    targetName: this.postDetailsData?.userName // 預設回覆貼文作者
  };

  /**繫結留言內容 */
  commentContent = '';

  /**儲存目前要放大顯示的圖片網址 */
  selectedFullImage = signal<string | null>(null);

  /**取得 HTML 中的 input 元素 */
  @ViewChild('commentInput') commentInput!: ElementRef<HTMLInputElement>;


  //-------------留言編輯-------------

  /**儲存目前編輯中的留言 ID，null 代表沒有任何留言在編輯 */
  editingCommentId: number | null = null;

  /**暫存編輯中的文字內容 */
  editContent: string = '';

  //-------------留言刪除-------------

  /**取得刪除的 Modal 元素 */
  @ViewChild('deleteModal') deleteModal!: ElementRef<HTMLDialogElement>;

  /**暫存準備刪除的留言ID */
  private pendingDeleteCommentId?: number;

  constructor(
    private postsService: PostsService,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private handleInteractionsService: HandleInteractions,
    private toastr: ToastrService,
    private scroller: ViewportScroller,
    private commentsService: CommentsService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.postId = +id;
        this.postsService.GetPostDetailsApi(this.postId).subscribe(data => {
          this.postDetailsData = data;
          this.replyStatus.targetName = data.userName;
        });
      }
    });

    this.authService.currentUser$.subscribe(data => {
      this.currentUser = data;
    });
  }

  /**互動呼叫Api */
  handleInteraction(post: PostDetailsData, type: string, reason?: string) {
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

  //-------------留言新增-------------

  /**留言icon滑到input錨點 */
  focusInput() {
    this.scroller.scrollToAnchor('comment-section');
    this.commentInput.nativeElement.focus();
  }

  /**場景 A：點擊「留言 Icon」或「底部 Input 框」*/
  resetToPostReply() {
    this.replyStatus = { parentId: null, targetName: this.postDetailsData?.userName };
    this.focusInput();
  }

  /**場景 B：點擊某則留言下的「回覆」按鈕*/
  setReplyTarget(commentId: number, userName: string) {
    this.replyStatus = { parentId: commentId, targetName: userName };
    this.focusInput();
  }

  /**送出按鈕點擊 */
  submitComment() {
    if (!this.currentUser) return;
    if (!this.commentContent.trim()) return;

    const dto: CreateCommentDto = {
      postId: this.postId!,
      parentCommentId: this.replyStatus.parentId,
      content: this.commentContent
    };

    this.commentsService.postCreateComment(dto).subscribe({
      next: (res) => {
        this.editContent = '';
        this.commentContent = '';
        this.replyStatus.parentId = null;
        this.toastr.info('發佈成功！🌊');

        //重新渲染畫面
        this.postsService.GetPostDetailsApi(this.postId!).subscribe(data => {
          this.postDetailsData = data;
          this.replyStatus.targetName = data.userName;
        });
      }
    });
  }

  //-------------留言編輯-------------

  /** 進入編輯模式*/
  startEdit(comment: PostComment) {
    this.editingCommentId = comment.commentId;
    this.editContent = comment.content;
  }

  /**取消編輯*/
  cancelEdit() {
    this.editingCommentId = null;
    this.editContent = '';
  }

  /**送出編輯留言 */
  editComment(comment: PostComment) {
    if (!this.currentUser) return;
    if (!this.editContent.trim()) return;

    const dto: CreateCommentDto = {
      postId: this.postId!,
      parentCommentId: null,
      content: this.editContent
    };

    this.commentsService.putEditComment(comment.commentId, dto).subscribe({
      next: (res) => {
        this.cancelEdit();
        this.commentContent = '';
        this.replyStatus.parentId = null;
        this.toastr.info('留言修改成功！');

        this.postsService.GetPostDetailsApi(this.postId!).subscribe(data => {
          this.postDetailsData = data;
          this.replyStatus.targetName = data.userName;
        });
      }
    });
  }

  //-------------留言刪除-------------

  /**打開刪除留言彈窗 */
  openDeleteModal(commentId: number) {
    this.pendingDeleteCommentId = commentId;
    this.deleteModal.nativeElement.showModal();
  }

  /**關閉刪除留言彈窗 */
  closeDeleteModal() {
    this.deleteModal.nativeElement.close();
    this.pendingDeleteCommentId = undefined;
  }

  /**送出刪除留言 */
  deleteComment() {
    if (!this.pendingDeleteCommentId) return;
    this.commentsService.delDeleteComment(this.pendingDeleteCommentId).subscribe({
      next: (res) => {
        this.toastr.info('您的留言已刪除！');

        this.postsService.GetPostDetailsApi(this.postId!).subscribe(data => {
          this.postDetailsData = data;
          this.replyStatus.targetName = data.userName;
        });
      }
    });
  }

}
