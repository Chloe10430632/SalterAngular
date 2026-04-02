import { Component, signal } from '@angular/core';
import { FavCard } from "../../myComponents/card/fav-card/fav-card";
import { Footer } from "../../../shared/footer/footer";
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Noavatar } from "../../myComponents/container/noavatar/noavatar";
import { MemFavListS } from '../../Service/mem-fav-list';
import { CoachAllInfoI } from '../../Interfaces/IIcoachAllinfo';
import { CoachCardInfoS } from '../../Service/coach-card-info-s';
import { CourseInformationS } from '../../Service/course-information';

//============!!父Component!!================//
//=============收藏==================//


@Component({
  selector: 'app-coach-favorite',
  imports: [FavCard, Footer, LittleIsland, Noavatar,],
  templateUrl: './mem-favorite.html',
  styleUrl: './mem-favorite.css',
})
export class MemFavorite {
  //#region 網頁載入時拿教練卡片資料
  //準備一個空籃子放 API 回傳的教練陣列
  coaches: CoachAllInfoI[] = []; // 存教練清單的陣列
  currentPage = 1;
  allCourseMap: { [key: number]: string } = {}; // 用來存 { 教練ID: 課程名稱 }
  myFavIds = signal<number[]>([]);
  PAGE_SIZE = 6; // 根據你的後端每頁筆數設定
  hasMorePages = true; // ← 新增這個旗標
  isLoading = false;
  //=======================================//

  constructor(private coachAllInfoS: CoachCardInfoS,
    private courseNameS: CourseInformationS,
    private memFavS: MemFavListS,
  ) { }
  //=======================================//

  ngOnInit(): void {
    this.loadHeart();
    this.loadCoach();
  }
  //=======================================//

  LoadMore() {
    this.currentPage++;
    this.loadCoach();
  }
  loadHeart() {
    this.coachAllInfoS.HeartIds().subscribe(res => {
      this.myFavIds.set(res.data); // 抓一次，存起來
    });
  }
  loadCoach() {
    this.isLoading = true;
    this.memFavS.getFavList(this.currentPage).subscribe({
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
        this.isLoading = false;
        console.error(err);
        this.hasMorePages = false; // 連線錯誤也隱藏按鈕
      }
    });
  }
  prepareCourseData() {
    const allList = [...this.coaches];
    if (allList.length === 0) return;

    allList.forEach(coach => {
      this.courseNameS.getLatestCourseByCoach(coach.coachId).subscribe({
        next: (res) => {
          // 有課程 → 顯示標題；後端說沒課 → 顯示提示文字
          this.allCourseMap[coach.coachId] = res
            ? (res.data.title || '新課程準備中...')
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
  }
}
