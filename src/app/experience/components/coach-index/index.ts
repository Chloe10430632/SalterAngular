//#region import
import { Component, Injectable, OnInit } from '@angular/core';
import { CoachCard } from '../../myComponents/card/coach-card/coach-card';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Footer } from '../../../shared/footer/footer';
import { CommonModule, NgClass } from '@angular/common';
import { Search } from '../../myComponents/search/search';
import { BtnCoachSwitch } from '../../myComponents/btn/btn-coach-switch/btn-coach-switch';
import { forkJoin, of, throwError } from 'rxjs'; // of 用來處理空值
import { inject } from '@angular/core/primitives/di';
import { BtnRankPop } from "../../myComponents/btn/btn-rank-pop/btn-rank-pop";
import { BtnRankNew } from "../../myComponents/btn/btn-rank-new/btn-rank-new";
import { rankItem } from '../../Service/SRank';
import { AuthService } from '../../../core/services/auth-service';
import { LittleIsland } from "../../myComponents/little-island/little-island";

//#endregion


@Component({
  selector: 'app-index',
  imports: [LittleIsland, BtnRankPop, CommonModule, BtnCoachSwitch, Search, CoachCard, NgClass, Footer, FormsModule, BtnRankNew, LittleIsland],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index implements OnInit {
  currentUser: any = null;
  //#region 網頁載入時拿教練卡片資料
  //準備一個空籃子放 API 回傳的教練陣列
  coaches: any[] = [];
  isLoading = false;
  isEnd = false;
  currentPage = 1;
  //注入HttpClient
  constructor(private client: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    })
    this.getPopRank();

  }
  getPopRank() {
    if (this.isLoading || this.isEnd) return; // 防止重複點擊
    this.isLoading = true; // 開始轉圈圈/秀骨架

    //把 URL 改成動態的，把 currentPage 傳給後端
    this.client.get<any[]>(`https://localhost:7017/api/Exp/Exp/PopRank?page=${this.currentPage}&pageSize=6`).subscribe({
      next: (data) => {
        setTimeout(() => {
          if (data.length < 6) {
            this.isEnd = true;
          }
          //用 ... 把新拿到的 6 個教練，「接」在舊的教練後面
          this.coaches = [...this.coaches, ...data]; //資料先抓到容器裡
          this.currentPage++;
          //console.log('API 拿到的資料：', data);
          //關閉遮蓋效果
          this.isLoading = false;
        }, 1000);
      }, //延遲1.5秒
      error: (err) => {
        console.error('API 壞掉啦：', err);
        this.isLoading = false;
      }
    });
  }
  //#endregion

  //#region ???search--用forkin

  indexSearch(text: string): void {
    console.log('父元件：準備丟出球，內容是：', text); // 加這行測試
    const s_trim = text.trim();
    if (!s_trim)
      return (alert("關鍵字掉海裡了..."));

    if (this.isLoading || this.isEnd) return; // 防止重複點擊
    this.isLoading = true; // 開始轉圈圈/秀骨架


    //自動幫你處理中文和空格編碼
    const params = new HttpParams().set('key', s_trim);
    // 3. 同時呼叫 3 個 API
    forkJoin({
      dist: this.client.get<any[]>(`https://localhost:7017/api/Exp/Exp/DistSearch`, { params }),
      spe: this.client.get<any[]>(`https://localhost:7017/api/Exp/Exp/SpeSearch`, { params }),
      name: this.client.get<any[]>(`https://localhost:7017/api/Exp/Exp/NameSearch`, { params })
    }).subscribe({
      next: (res) => {
        // 4. 把三份結果合併在一起
        // 這裡是用「聯集」，只要任何一個 API 有撈到都顯示
        const combine = [...res.dist, ...res.spe, ...res.name];

        this.coaches = this.removeDuplicates(combine);
        console.log("關鍵字整理後:", this.coaches);
      },
      error: (err) => {
        console.error('API 壞掉啦', err);
        this.isLoading = false;
        return (alert("關鍵字掉海裡了..."));
      }
    });
  }
  removeDuplicates(data: any[]) {
    return data.filter((item, index, self) =>
      index === self.findIndex((t) => t.id === item.id));
  }

  //#endregion

  //#region 排序
  refreshData() {
    this.coaches = []; // 先把舊資料清空，畫面就會變回初始狀態
    this.currentPage = 1; // 頁碼回到第一頁
    this.isEnd = false; // 重置結束狀態

    this.getPopRank();// 重新呼叫你寫好的 API 抓取函式
  }
  handleRankUpdate() {
    this.refreshData();
  }

  //#region 最新
  displayRanks: rankItem[] = [];
  //接收子組件傳來的 $event (即 data)
  handleNewRank(data: rankItem[]) {
    //打開遮罩
    this.isLoading = true;
    setTimeout(() => {
      this.displayRanks = data; // 更新畫面資料
      this.coaches = data;
      // 重新校正分頁狀態（假設重新搜尋後回到第一頁）
      this.currentPage = 1;
      this.isEnd = data.length < 6;

      // 3. 最後一步：大功告成，關閉遮罩！
      this.isLoading = false;

    }, 1000);
  }
  //#endregion
  //#endregion

}
//#endregion




//#region
//#endregion


