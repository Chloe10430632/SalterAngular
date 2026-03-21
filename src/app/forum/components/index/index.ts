import { AdsService } from './../../services/ads-service';
import { Component, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { Router, RouterOutlet, RouterLinkWithHref, RouterLinkActive } from '@angular/router';
import { BoardList } from '../../interfaces/boardList';
import { BoardsService } from '../../services/boards-service';
import { AdData } from '../../interfaces/adData';
import Sortable from 'sortablejs';
import { ToastrService } from 'ngx-toastr';
import { CurrentUser } from '../../interfaces/currentUser';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-index',
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive],
  templateUrl: './index.html',
  styleUrl: './index.css',
  encapsulation: ViewEncapsulation.None,
})
export class Index implements OnInit {

  /**全部看板選單列表 */
  allBoardList: BoardList[] = [];

  /**全部打卡地點選單列表 */
  allLocationList: any[] = [
    {
      id: 315,
      name: "淡水漁人碼頭",
      addressText: "新北市淡水區觀海路",
      cityName: "新北市",
      districtName: "淡水區",
      lat: 25.179200,
      lng: 121.410300,
    },
    {
      id: 316,
      name: "龍洞灣海洋公園",
      addressText: "新北市淡水區觀海路",
      cityName: "新北市",
      districtName: "淡水區",
      lat: 25.179200,
      lng: 121.410300,
    },
    {
      id: 317,
      name: "福隆雙溪河口",
      addressText: "新北市淡水區觀海路",
      cityName: "新北市",
      districtName: "淡水區",
      lat: 25.179200,
      lng: 121.410300,
    },
  ];

  /**Top5熱門看板列表 */
  boardListPop5: BoardList[] = [];

  /**Top5追蹤推薦看板列表 */
  boardListFollow5: BoardList[] = [];

  /**廣告資料 */
  adDetails?: AdData;

  /**貼文標籤 */
  tags = signal<string[]>([]);

  /**貼文圖片 */
  previews = signal<string[]>([]);

  /**選擇的看板 */
  selectedBoard?: BoardList;

  /**選擇的打卡地點 */
  selectedLocation?: any;

  /**目前登入會員資料 */
  currentUser?: CurrentUser;

  /**後端伺服器PORT */
  backendServer = "https://localhost:7017";

  constructor(private boardsService: BoardsService, private adsService: AdsService, private toastr: ToastrService, private authService: AuthService) {

  }

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



  }

  getAllBoardList() {
    this.boardsService.GetAllBoardsApi().subscribe(data => {
      this.allBoardList = data;
    });
  }

  selectBoard(board: BoardList) {
    this.selectedBoard = board;
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
  selectLocation(location: any) {
    this.selectedLocation = location;
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  getUser() {
    this.authService.getProfile().subscribe(data => {
      this.currentUser = data;
    });
  }


  // --- 標籤功能 ---
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

  removeTag(index: number) {
    this.tags.update(prev => prev.filter((_, i) => i !== index));
  }





  // --- 圖片預覽與排序 ---
  onFileChange(event: any) {
    const files = Array.from(event.target.files as FileList);
    const remaining = 5 - this.previews().length;

    if (remaining < 0) {
      this.toastr.info('最多只能上傳 5 張照片喔！');
      return;
    }

    files.slice(0, remaining).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previews.update(prev => [...prev, e.target.result]);
        // 圖片增加後，初始化或更新排序
        this.initSortable();
      };
      reader.readAsDataURL(file);
    });

    event.target.value = ''; // 清空 input
  }

  removeImage(index: number) {
    this.previews.update(prev => prev.filter((_, i) => i !== index));
  }

  initSortable() {
    // 延遲執行確保 DOM 已渲染
    setTimeout(() => {
      const el = document.getElementById('image_preview_container');
      if (!el) return;

      // 確保不會重複初始化
      Sortable.create(el, {
        animation: 150,
        ghostClass: 'opacity-50',
        filter: '.btn', // 確保點擊刪除按鈕時不會觸發拖拽
        onEnd: (evt) => {
          // 取得目前的陣列值
          const currentPreviews = this.previews();
          if (evt.oldIndex === evt.newIndex || evt.oldIndex === undefined || evt.newIndex === undefined) return;

          const parentEl = evt.from;
          const targetEl = evt.item;
          const nextEl = parentEl.children[evt.oldIndex!];

          if (evt.newIndex! > evt.oldIndex!) {
            parentEl.insertBefore(targetEl, nextEl);
          } else {
            parentEl.insertBefore(targetEl, nextEl.nextSibling);
          }

          const newOrder = [...currentPreviews];
          const [movedItem] = newOrder.splice(evt.oldIndex!, 1);
          newOrder.splice(evt.newIndex!, 0, movedItem);

          this.previews.set(newOrder);
        }
      });
    }, 0);
  }



  clearPost() {
    this.selectedLocation = undefined;
    this.selectedBoard = undefined;
    this.tags.set([]);
    this.previews.set([]);

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

}





