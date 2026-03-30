import { CoachAllInfoS } from './../../Service/coach-all-info-s';
//#region import
import { Component, Injectable, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Footer } from '../../../shared/footer/footer';
import { CommonModule } from '@angular/common';
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Rank } from '../../Service/rank';
import { CoachAllInfoI } from '../../Interfaces/coachallinfo';
import { FavCard } from '../../myComponents/card/fav-card/fav-card';
import { UiS } from '../../Service/UiS';
import { CourseForOneS } from '../../Service/course-for-one';


//#endregion


//============!!父Component!!================//


@Component({
  selector: 'app-index',
  standalone: true,
  imports: [LittleIsland, CommonModule, FormsModule, LittleIsland, Footer, FavCard],
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

  //=======================================//
  constructor(private rank: Rank,
    private courseNameS: CourseForOneS,
    private coachAllInfoS: CoachAllInfoS,
    private uiS: UiS,
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
    this.coachAllInfoS.HeartIds().subscribe(res => {
      this.myFavIds.set(res.data); // 抓一次，存起來
    });
  }
  prepareCourseData() {
    const allList = [...this.coaches, ...this.latestC];
    if (allList.length === 0) return;

    allList.forEach(coach => {
      this.courseNameS.getLatestCourseByCoach(coach.coachId).subscribe({
        next: (res) => {
          // 有課程 → 顯示標題；後端說沒課 → 顯示提示文字
          this.allCourseMap[coach.coachId] = res.isSuccess
            ? (res.data?.title || '新課程準備中...')
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
    this.uiS.toastMessage.set('已從收藏中移除');
    console.log(`教練 ${coachId} 被取消收藏了（在首頁通常不執行刪除畫面動作）`);
    // 如果你在首頁也想即時連動某些狀態，可以在這寫
  }
}


//#endregion




//#region
//#endregion


