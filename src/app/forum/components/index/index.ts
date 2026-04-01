import { CurrentUser } from './../../interfaces/currentUser';
import { AdsService } from './../../services/ads-service';
import { Component, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { Router, RouterOutlet, RouterLinkWithHref, RouterLinkActive } from '@angular/router';
import { BoardList } from '../../interfaces/boardList';
import { BoardsService } from '../../services/boards-service';
import { AdDetails } from '../../interfaces/AdDetails';
import Sortable from 'sortablejs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth-service';
import { PostsService } from '../../services/posts-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { TripService } from '../../../trip/services/trip';
import { SensitiveWordsService } from '../../services/sensitive-words-service';
import { catchError, debounceTime, distinctUntilChanged, filter, of, switchMap, tap } from 'rxjs';
import { PostsAgentService } from '../../services/posts-agent-service';

@Component({
  selector: 'app-index',
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './index.html',
  styleUrl: './index.css',
  encapsulation: ViewEncapsulation.None,
})
export class Index implements OnInit {

  /**全部看板選單列表 */
  allBoardList: BoardList[] = [];

  /**全部打卡地點選單列表 */
  allLocationList: any[] = [];

  /**Top5熱門看板列表 */
  boardListPop5: BoardList[] = [];

  /**Top5追蹤推薦看板列表 */
  boardListFollow5: BoardList[] = [];

  /**廣告資料 */
  adDetails?: AdDetails;

  /**貼文標籤 */
  tags = signal<string[]>([]);

  /**貼文圖片 */
  previews = signal<string[]>([]);

  /**選擇的看板 */
  selectedBoard?: BoardList;

  /**選擇的打卡地點 */
  selectedLocation?: any;

  /**上傳的圖片資料 */
  selectedFiles = signal<File[]>([]);

  /**後端伺服器PORT */
  backendServer = `${environment.domain}`;

  /**目前使用者 */
  currentUser?: CurrentUser;

  /**發佈貼文資料結構 */
  postForm!: FormGroup;

  /**控制進度條顯示 */
  isPublishing = signal(false);

  /**控制進度百分比 */
  uploadProgress = signal(0);

  /**Sortable是否已初始化 */
  isSortableInitialized = false;

  /**儲存目前要放大顯示的圖片網址 */
  selectedFullImage = signal<string | null>(null);

  //--------檢查使用者輸入的文字是否違規--------
  /**敏感詞 */
  badWords: string[] = [];

  /**審核中 */
  isChecking = false;

  //--------請LLM的AIAgent幫忙優化文案--------
  /**對話ID */
  conversationId?: string;

  /**使用者原本的貼文內容 */
  originalContent?: string;

  /**Agent生成的貼文內容 */
  postAgentContent?: string;

  /**AI優化中 */
  isOptimizing = false;

  /**是否進入文案對比預覽模式 */
  showComparison = false;


  /**建構子注入 */
  constructor(
    private boardsService: BoardsService,
    private adsService: AdsService,
    private toastr: ToastrService,
    public authService: AuthService,
    private postsService: PostsService,
    private tripService: TripService,
    private formBuilder: FormBuilder,
    private router: Router,
    private checkWordsService: SensitiveWordsService,
    private postAgentService: PostsAgentService) { }

  ngOnInit(): void {
    this.boardsService.GetTop5PopBoardsApi().subscribe(data => {
      this.boardListPop5 = data;
    });

    this.boardsService.GetTop5FollowBoardsApi().subscribe(data => {
      this.boardListFollow5 = data;
    });

    this.adsService.GetAdsApi().subscribe(data => {
      this.adDetails = data;
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


    this.postForm.get('content')!.valueChanges.pipe(
      debounceTime(1200),
      distinctUntilChanged(),
      filter(val => val !== null && val !== undefined),
      tap(() => {
        this.isChecking = true;
        this.badWords = [];
      }),
      switchMap(val =>
        this.checkWordsService.postCheckWordsApi(val).pipe(
          // 重要：在 switchMap 內部 catchError，這樣外部流才不會死掉
          catchError(err => {
            console.error('敏感詞檢查失敗', err);
            return of({ violatedWords: [] }); // 發生錯誤時回傳空陣列，讓流程繼續
          })
        )
      )
    ).subscribe({
      next: (res) => {
        this.isChecking = false;
        this.badWords = res.violatedWords;
      },
      error: (err) => {
        // 這裡通常抓不到錯誤了，因為裡面已經處理掉
        this.isChecking = false;
      }
    });


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

  /**發佈貼文 - File */
  onSubmit(isPosted: boolean) {
    if (this.postForm.invalid) return;

    // 1. 立即關閉 Modal 並啟動進度條
    const modal = document.getElementById('post_modal') as HTMLDialogElement;
    if (modal) modal.close();
    this.isPublishing.set(true);
    this.uploadProgress.set(0);

    // 2. 開始第一階段：如果有圖片就傳
    if (this.selectedFiles().length > 0) {
      this.postsService.PostUploadImages(this.selectedFiles()).subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            // 計算進度百分比
            const percent = Math.round((100 * event.loaded) / (event.total || 1));
            this.uploadProgress.set(percent * 0.85);
          } else if (event.type === HttpEventType.Response) {
            // 圖片上傳完成，拿到回傳的 string[]
            this.proceedToCreatePost(event.body!, isPosted);
          }
        },
        error: (err) => {
          this.isPublishing.set(false);
          this.toastr.info('圖片上傳失敗');
        }
      });
    } else {
      this.proceedToCreatePost([], isPosted);
    }

  }

  /**發佈貼文 - Json */
  private proceedToCreatePost(imageUrls: string[], isPosted: boolean) {
    // 3. 第二階段：發佈貼文內容
    const payload = {
      ...this.postForm.value,
      imageUrls,
      isPosted: isPosted,
      tags: this.tags().map(tagName => ({
        tagId: 0,
        tagName: tagName
      }))
    };

    this.postsService.PostCreatePost(payload).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.isPublishing.set(false); // 延遲關閉，讓使用者看到完成的感覺
          this.clearPost();
        }, 3000);
        this.uploadProgress.set(100); // 強制滿格
        this.toastr.info('貼文發佈成功!');
        this.router.navigate(['/forum/member/wall'], {
          queryParams: { sortBy: 'posted' }
        });
      },
      error: () => this.toastr.info('貼文發佈失敗')
    });
  }

  /**判斷是否登入 */
  isLogin() {
    if (!this.currentUser) {
      this.router.navigate(["/login"]);
    }
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

  /** 圖片預覽與排序 */
  async onFileChange(event: any) {
    const files = Array.from(event.target.files as FileList);
    const remaining = 5 - this.previews().length;

    if (remaining <= 0) {
      this.toastr.info('最多只能上傳 5 張照片喔！');
      return;
    }

    const filesToAdd = files.slice(0, remaining);

    // 1. 同步更新 File 物件 Signal (這部分順序是固定的)
    this.selectedFiles.update(prev => [...prev, ...filesToAdd]);

    // 2. 使用 Promise.all 確保非同步讀取後，順序依然對齊
    try {
      const readFilePromises = filesToAdd.map(file => this.readFileAsBase64(file));
      const newBase64Results = await Promise.all(readFilePromises);

      // 3. 一次性更新預覽圖 Signal，保證順序與 filesToAdd 一致
      this.previews.update(prev => [...prev, ...newBase64Results]);

    } catch (error) {
      this.toastr.error('圖片讀取失敗');
      console.error(error);
    }

    this.initSortable();
    event.target.value = '';
  }

  /** 輔助方法：將 FileReader 包裝成 Promise */
  private readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => resolve(e.target.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  /**移除圖片 */
  removeImage(index: number) {
    this.previews.update(prev => prev.filter((_, i) => i !== index));
    this.selectedFiles.update(prev => prev.filter((_, i) => i !== index));
  }

  /**初始化拖拉排序 */
  initSortable() {
    if (this.isSortableInitialized) return;
    // 延遲執行確保 DOM 已渲染
    setTimeout(() => {
      const el = document.getElementById('image_preview_container');
      if (!el) return;
      this.isSortableInitialized = true; // 標記已執行

      Sortable.create(el, {
        animation: 150,
        ghostClass: 'opacity-50',
        filter: '.btn',
        onEnd: (evt) => {
          const { oldIndex, newIndex, from, item } = evt;
          if (oldIndex === newIndex || oldIndex == null || newIndex == null) return;

          if (newIndex > oldIndex) {
            from.insertBefore(item, from.children[oldIndex]);
          } else {
            from.insertBefore(item, from.children[oldIndex + 1]);
          }

          const currentPreviews = [...this.previews()];
          const currentFiles = [...this.selectedFiles()];

          // 同步移動 Previews
          const [movedPreview] = currentPreviews.splice(oldIndex, 1);
          currentPreviews.splice(newIndex, 0, movedPreview);

          // 同步移動 Files
          const [movedFile] = currentFiles.splice(oldIndex, 1);
          currentFiles.splice(newIndex, 0, movedFile);

          this.previews.set(currentPreviews);
          this.selectedFiles.set(currentFiles);
        }
      });
    }, 0);
  }

  /**清除貼文內容 */
  clearPost() {
    this.isSortableInitialized = false;
    this.selectedLocation = undefined;
    this.selectedBoard = undefined;
    this.tags.set([]);
    this.previews.set([]);
    this.selectedFiles.set([]);
    this.badWords = [];

    // 3. 重置 HTML 原生元素 (重要！)
    // 找到 Modal 裡的 textarea 並清空文字
    const textarea = document.querySelector('#post_modal textarea') as HTMLTextAreaElement;
    if (textarea) textarea.value = '';

    // 找到 File Input 並清空，否則「選同一張圖」第二次會沒反應
    const fileInput = document.getElementById('image_input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';

    // 4. (選做) 關閉 Modal 本身
    const modal = document.getElementById('post_modal') as HTMLDialogElement;
    if (modal) modal.close();
  }

  /**放大圖片 - 開啟燈箱 */
  openLightbox(url: string) {
    this.selectedFullImage.set(url);
    const modal = document.getElementById('lightbox_modal_post') as HTMLDialogElement;
    modal?.showModal();
  }

  /**放大圖片 - 關閉燈箱 */
  closeLightbox() {
    this.selectedFullImage.set(null);
  }

  //--------AI文案優化--------
  optimizeWithAI() {

    const content = this.postForm.get('content')?.value?.trim();
    if (!content) return;

    this.originalContent = content; // 備份舊文案供 UI 對比使用
    this.isOptimizing = true;

    // 核心邏輯：如果沒有 ID 就先抓 ID，有的話直接進入下一步
    const getConversationId$ = this.conversationId
      ? of({ conversationId: this.conversationId }) // 已經有了，封裝成 Observable 直接過
      : this.postAgentService.GetPostAgentApi();    // 沒有，打 API 抓

    getConversationId$.pipe(
      tap(res => {
        this.conversationId = res.conversationId; // 更新 ID
      }),
      switchMap(res => {
        const dto = {
          conversationId: res.conversationId,
          userMessage: this.originalContent!,
          agentMessage: ''
        };
        // 串接第二個 API
        return this.postAgentService.PostPostAgentApi(dto);
      })
    ).subscribe({
      next: (res) => {
        this.postAgentContent = res.agentMessage;

        this.showComparison = true;
        this.isOptimizing = false;
      },
      error: (err) => {
        console.error('AI 優化失敗:', err);
        this.isOptimizing = false;
      }
    });

  }

  rejectAI() {
    this.showComparison = false;
    this.postAgentContent = '';
    // 內容會自動維持在原本的 postForm.value.content
  }
  acceptAI() {
    this.postForm.get('content')?.patchValue(this.postAgentContent, { emitEvent: false });
    this.badWords = []; // 手動清空，因為沒跑 API 檢查
    this.showComparison = false;
    // 記得清空暫存
    this.postAgentContent = '';
  }
}





