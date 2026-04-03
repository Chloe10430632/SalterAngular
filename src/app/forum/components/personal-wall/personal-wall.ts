import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { CurrentUser } from '../../interfaces/currentUser';
import { AuthService } from '../../../core/services/auth-service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { PostList } from '../../interfaces/postList';
import { DecimalPipe } from '@angular/common';
import { RelativeTimePipe } from '../../pipes/relative-time-pipe';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostsService } from '../../services/posts-service';
import { PostInteractionsService } from '../../services/post-interactions-service';
import { ToastrService } from 'ngx-toastr';
import { PostInteractionsRequest } from '../../interfaces/postInteractionsRequest';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BoardList } from '../../interfaces/boardList';
import { BoardsService } from '../../services/boards-service';
import { TripService } from '../../../trip/services/trip';
import { CreatePostDto } from '../../interfaces/CreatePostDto';
import { PostDetailsData } from '../../interfaces/PostDetailsData';
import { AvatarPipe } from "../../../shared/pipes/avatar-pipe";
import { NotificationService } from '../../../shared/notifyService/notification-service';

@Component({
  selector: 'app-personal-wall',
  imports: [DecimalPipe, RelativeTimePipe, InfiniteScrollDirective, RouterLink, ReactiveFormsModule, AvatarPipe],
  templateUrl: './personal-wall.html',
  styleUrl: './personal-wall.css',
})
export class PersonalWall implements OnInit {

  /**當前環境網址根目錄 */
  readonly domain = window.location.origin;

  /**目前使用者 */
  currentUser?: CurrentUser;

  /**切換我的收藏/我的文章 */
  currentSortBy: string = 'posted'; // 預設值

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

  //------修改貼文------------
  /**貼文詳細資料 */
  postDetailsData?: PostDetailsData;

  /**編輯貼文模式 */
  isEditMode = false;

  /**暫存準備編輯的 ID */
  editingPostId: number | null = null;

  /**修改貼文資料結構 */
  postForm!: FormGroup;

  /**選擇的看板 */
  selectedBoard?: BoardList;

  /**選擇的打卡地點 */
  selectedLocation?: any;

  /**貼文標籤 */
  tags = signal<string[]>([]);

  /**全部看板選單列表 */
  allBoardList: BoardList[] = [];

  /**全部打卡地點選單列表 */
  allLocationList: any[] = [];

  //-------刪除貼文-----------
  // 取得刪除的 Modal 元素
  @ViewChild('deleteModal') deleteModal!: ElementRef<HTMLDialogElement>;

  // 暫存準備刪除的 ID
  private pendingDeletePostId?: number;

  constructor(
    public authService: AuthService,
    private postsService: PostsService,
    private boardsService: BoardsService,
    private postInteractionsService: PostInteractionsService,
    private toastr: ToastrService,
    private tripService: TripService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private n: NotificationService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.currentSortBy = params['sortBy'] || 'posted';
      this.resetAndLoad();
    });

    this.authService.currentUser$.subscribe(data => {
      this.currentUser = data;
    });

    this.postForm = this.formBuilder.group({
      boardId: [, Validators.required],
      content: ['', Validators.required],
      locationId: [null],
      tags: this.formBuilder.array([])
    });
  }


  /**不同篩選條件執行分頁邏輯 */
  loadMore() {
    if (this.isLoading || this.isFinished) return;
    this.isLoading = true;
    const lastPost = this.postList[this.postList.length - 1];

    // 2. 根據目前狀態決定呼叫哪隻 API
    const apiCall$ = this.currentSortBy === 'collect'
      ? this.postsService.GetUserCollectPostApi(lastPost?.createdAt, lastPost?.postId)
      : this.postsService.GetUserPostedPostApi(lastPost?.createdAt, lastPost?.postId);

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

  /**切換貼文排序重置 */
  private resetAndLoad() {
    this.postList = [];
    this.isFinished = false;
    this.isLoading = false;
    this.loadMore();
  }

  /**互動呼叫Api */
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

  /**複製貼文網址 */
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

  /**打開編輯貼文彈窗 */
  openEditModal(postId: number) {
    this.isEditMode = true;
    this.editingPostId = postId;

    // 1. 抓取舊資料
    this.postsService.GetPostDetailsApi(postId).subscribe(data => {
      this.postDetailsData = data;


      // 2. 帶入表單資料 (僅限：內容、看板)
      this.postForm.patchValue({
        content: data.fullContent,
        boardId: data.boardId,
        locationId: data.locationId
      });

      this.tags.set(data.postTags || []);

      // 4. 顯示 Modal
      const modal = document.getElementById('edit_modal') as HTMLDialogElement;
      modal.showModal();
    });
  }

  /**清除貼文內容 */
  clearPost() {

    this.selectedLocation = undefined;
    this.selectedBoard = undefined;
    this.tags.set([]);

    // 3. 重置 HTML 原生元素 (重要！)
    // 找到 Modal 裡的 textarea 並清空文字
    const textarea = document.querySelector('#post_modal textarea') as HTMLTextAreaElement;
    if (textarea) textarea.value = '';

    // 4. (選做) 關閉 Modal 本身
    const modal = document.getElementById('post_modal') as HTMLDialogElement;
    if (modal) modal.close();
  }

  /**載入所有看板清單 */
  getAllBoardList() {
    if (this.allBoardList.length > 0) return;
    this.boardsService.GetAllBoardsApi().subscribe(data => {
      this.allBoardList = data;
    });
  }

  /**選定發文看板 */
  selectBoard(board: BoardList) {
    this.selectedBoard = board;
    this.postForm.patchValue({ boardId: board.boardId });
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  /**讀取所有地點資料 */
  getAllLocations() {
    if (this.allLocationList.length > 0) return;
    this.tripService.getAllLocations().subscribe({
      next: (res) => {
        this.allLocationList = res.data;
      }
    });
  }

  /**選定打卡地點 */
  selectLocation(location: any) {
    this.selectedLocation = location;
    this.postForm.patchValue({ locationId: location.id });
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  /** HashTag新增標籤 */
  addTag(event: any) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    if (value && !this.tags().includes(value)) {
      this.tags.update(prev => [...prev, value]);
      input.value = '';
    } else if (this.tags().includes(value)) {
      this.toastr.info('標籤重複囉！');
    }
  }

  /** HashTag移除標籤 */
  removeTag(index: number) {
    this.tags.update(prev => prev.filter((_, i) => i !== index));
  }

  /**送出編輯按鈕邏輯 */
  handleEditPostSubmit(isPosted: boolean) {
    if (this.postForm.invalid) return;

    // 1. 立即關閉 Modal 並啟動進度條
    const modal = document.getElementById('edit_modal') as HTMLDialogElement;
    if (modal) modal.close(); // 呼叫你原本關閉 dialog 的 method

    const dto: CreatePostDto = {
      ...this.postForm.value,
      isPosted: isPosted,
      tags: this.tags().map(tagName => ({
        tagId: 0,
        tagName: tagName
      }))
    };

    if (!this.currentUser) return;

    if (this.isEditMode && this.editingPostId) {
      // 執行修改 API
      this.postsService.putEditPost(this.editingPostId, dto).subscribe(() => {
        this.resetAndLoad();
      });
    }



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
        this.resetAndLoad();
      }
    });
  }

}
