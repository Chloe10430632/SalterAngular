//#region import
import { Component, Injectable, OnInit } from '@angular/core';
import { CoachCard } from '../../myComponents/coach-card/coach-card';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Footer } from '../../../shared/footer/footer';
import { CommonModule, NgClass } from '@angular/common';
import { Search } from '../../myComponents/search/search';
import { BtnCoachSwitch } from '../../myComponents/btn-coach-switch/btn-coach-switch';
import { forkJoin, of, throwError } from 'rxjs'; // of 用來處理空值
import { inject } from '@angular/core/primitives/di';
import { BtnRankPop } from "../../myComponents/btn-rank-pop/btn-rank-pop";
import { BtnRankNew } from "../../myComponents/btn-rank-new/btn-rank-new";

//#endregion


@Component({
  selector: 'app-index',
  imports: [BtnRankPop, CommonModule, BtnCoachSwitch, Search, CoachCard, NgClass, Footer, FormsModule, BtnRankNew],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index implements OnInit {

  //#region 網頁載入時拿教練卡片資料
  //準備一個空籃子放 API 回傳的教練陣列
  coaches: any[] = [];
  isLoading = false;
  isEnd = false;
  currentPage = 1;
  //注入HttpClient
  constructor(private client: HttpClient) { }

  ngOnInit(): void {
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
        }, 1500);
      }, //延遲1.5秒
      error: (err) => {
        console.error('API 壞掉啦：', err);
        this.isLoading = false;
      }
    });
  }
  //#endregion

  //#region search--用forkin
  searchReasult: any[] = [];
  indexSearch(text: string): void {
    const s_trim = text.trim();
    if (!this.searchReasult)
      return (alert("關鍵字掉海裡了..."));

    //空格拆開keyword
    const keywords = s_trim.split(/\s+/);
    const query = keywords.join(' ');
    // 3. 同時呼叫 3 個 API
    // 就算其中一個沒填，我們也發送請求 (或是你可以寫 if 判斷)
    forkJoin({
      dist: this.client.get<any[]>(`https://localhost:7017/api/Exp/Exp/DistSearch?query=${query}`),
      spe: this.client.get<any[]>(`https://localhost:7017/api/Exp/Exp/SpeSearch?query=${query}`),
      name: this.client.get<any[]>(`https://localhost:7017/api/Exp/Exp/NameSearch?query=${query}`)
    }).subscribe({
      next: (res) => {
        // 4. 把三份結果合併在一起
        // 這裡是用「聯集」，只要任何一個 API 有撈到都顯示
        const combine = [...res.dist, ...res.spe, ...res.name];

        this.searchReasult = this.removeDuplicates(combine);
      },
      error: (err) => console.error('API 壞掉啦', err)
    });
  }
  removeDuplicates(data: any[]) {
    return data.filter((item, index, self) =>
      index === self.findIndex((t) => t.id === item.id));
  }
  //#endregion



}

//#region
//#endregion


