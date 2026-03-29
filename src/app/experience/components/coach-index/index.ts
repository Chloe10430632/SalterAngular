import { ToastrService } from 'ngx-toastr';
//#region import
import { Component, Injectable, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Footer } from '../../../shared/footer/footer';
import { CommonModule, NgClass } from '@angular/common';
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Rank } from '../../Service/rank';
import { CoachAllInfoI } from '../../Interfaces/coachallinfo';
import { CoachAllInfoS } from '../../Service/coach-all-info-s';
import { FavCard } from '../../myComponents/card/fav-card/fav-card';
import { UiS } from '../../Service/UiS';

//#endregion


//============!!父Component!!================//


@Component({
  selector: 'app-index',
  imports: [LittleIsland, CommonModule, FormsModule, LittleIsland, Footer, FavCard],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index implements OnInit {
  coaches: CoachAllInfoI[] = []; // 存教練清單的陣列
  latestC: CoachAllInfoI[] = [];
  currentPage = 1;


  //=======================================//
  constructor(private rank: Rank,
    private uiS: UiS,
  ) { }
  //=======================================//
  ngOnInit(): void {
    this.loadCoach();
    this.loadlatestC();
  }
  //=======================================//

  loadCoach() {
    this.rank.getPopRank(this.currentPage).subscribe({
      next: (data) => {
        this.coaches = [...this.coaches, ...data]; // 將新資料加入現有陣列
      }
    });
  }

  loadlatestC() {
    this.rank.getNewRank(this.currentPage).subscribe({
      next: (data) => {
        this.latestC = [...this.latestC, ...data]; // 將新資料加入現有陣列
      }
    });
  }

  LoadMore() {
    this.currentPage++;
    this.loadCoach();
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


