import { Component, OnInit } from '@angular/core';
import { CoachCard } from '../../myComponents/coach-card/coach-card';
import { HttpClient } from '@angular/common/http';
import { NgClass } from '@angular/common';
import { Search } from '../../myComponents/search/search';
import { BtnCoachSwitch } from '../../myComponents/btn-coach-switch/btn-coach-switch';

@Component({
  selector: 'app-index',
  imports: [BtnCoachSwitch, Search, CoachCard, NgClass],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index implements OnInit {

  //#region API拿教練卡片資料
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
    //#endregion



  }
}

//#region
//#endregion


