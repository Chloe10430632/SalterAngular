import { CoachCardInfoS } from '../../Service/coach-card-info-s';
import { Component, Injectable, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Footer } from '../../../shared/footer/footer';
import { CommonModule } from '@angular/common';
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Rank } from '../../Service/rank';
import { CoachAllInfoI } from '../../Interfaces/IIcoachAllinfo';
import { CourseInformationS } from '../../Service/course-information';
import { Search } from "../../myComponents/search/search";
import { FavCard } from '../../myComponents/card/fav-card/fav-card';
import { NotificationService } from '../../../shared/notifyService/notification-service';




//============!!父Component!!================//
//=============入口==================//


@Component({
  selector: 'app-index',
  standalone: true,
  imports: [LittleIsland, CommonModule, FormsModule, LittleIsland, Footer, FavCard, Search],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index implements OnInit {
  coaches: CoachAllInfoI[] = []; // 存教練清單的陣列
  latestC: CoachAllInfoI[] = [];
  currentPage = 1;
  allCourseMap: { [key: number]: string } = {}; // 用來存 { 教練ID: 課程名稱 }
  myFavIds = signal<number[]>([]);
  PAGE_SIZE = 6; // 根據你的後端每頁筆數設定
  hasMorePages = true; // ← 新增這個旗標
  searchCoaches: CoachAllInfoI[] = [];
  isSearching: boolean = false;

  //=======================================//
  constructor(private rank: Rank,
    private courseNameS: CourseInformationS,
    private coachAllInfoS: CoachCardInfoS,
    public notificationS: NotificationService
  ) { }
  //=======================================//
  ngOnInit(): void {
    this.loadCoach();
    this.loadlatestC();
    this.loadHeart(); // 頁面一打開就去抓收藏清單，看看有哪些教練在裡面
  }
  //=======================================//


  loadCoach() {
    this.rank.getPopRank(this.currentPage).subscribe({
      next: (res: any) => {
        const newData: CoachAllInfoI[] = Array.isArray(res?.data) ? res.data
          : Array.isArray(res) ? res
            : [];  // ← 後端沒資料時給空陣列，不會爆

        this.coaches = [...this.coaches, ...newData];

        // 沒拿到新資料就隱藏按鈕
        if (newData.length === 0) this.hasMorePages = false;

        this.prepareCourseData();
      },
      error: (err) => {
        console.error(err);
        this.hasMorePages = false; // 連線錯誤也隱藏按鈕
      }
    });
  }

  loadlatestC() {
    this.rank.getNewRank(1).subscribe({
      next: (res: any) => {
        if (res?.data && Array.isArray(res.data)) {
          this.latestC = res.data;
        } else if (Array.isArray(res)) {
          this.latestC = res;
        }

        // ← 最新教練資料進來後，補跑一次課程整理
        this.prepareCourseData();
      },
      error: (err) => console.error('loadlatestC API 連線失敗', err)
    });
  }

  LoadMore() {
    this.currentPage++;
    this.loadCoach();
  }
  loadHeart() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("訪客身分：不讀取收藏資料");
      this.myFavIds.set([]); // 確保收藏清單是空的
      return;
    }

    this.coachAllInfoS.HeartIds().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.myFavIds.set(res.data);
        }
      }, error: (err) => {
        // 萬一 Token 過期被後端退件，也清空清單
        this.notificationS.show("抓取收藏失敗", err);
        this.myFavIds.set([]);
      }
    }
    );
  }
  prepareCourseData() {
    const allList = [...this.coaches, ...this.latestC];
    if (allList.length === 0) return;

    allList.forEach(coach => {
      this.courseNameS.getLatestCourseByCoach(coach.coachId).subscribe({
        next: (res) => {
          // 有課程 → 顯示標題；後端說沒課 → 顯示提示文字
          this.allCourseMap[coach.coachId] = res
            ? (res.title || '新課程準備中...')
            : '暫無開課計畫';
        },
        error: () => {
          // 這裡只剩真正的網路錯誤才會進來
          this.allCourseMap[coach.coachId] = '暫無開課計畫';
        }
      });
    });
  }

  // 處理子組件傳來的 removeMe 事件
  handleRemove(coachId: number) {
    console.log(`教練 ${coachId} 被取消收藏了（在首頁通常不執行刪除畫面動作）`);
    // 如果你在首頁也想即時連動某些狀態，可以在這寫
  }

  handleSearchResult(result: CoachAllInfoI[]) {
    console.log(result);
    this.searchCoaches = result;
    this.isSearching = true;
  }
  backToDefault() {
    this.isSearching = false;
    this.searchCoaches = []; // 清空搜尋結果
  }
}






//#region
//#endregion


