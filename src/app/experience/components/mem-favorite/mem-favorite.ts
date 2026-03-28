import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FavCard } from "../../myComponents/card/fav-card/fav-card";
import { Footer } from "../../../shared/footer/footer";
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Noavatar } from "../../myComponents/container/noavatar/noavatar";

@Component({
  selector: 'app-coach-favorite',
  imports: [FavCard, Footer, LittleIsland,  Noavatar,],
  templateUrl: './mem-favorite.html',
  styleUrl: './mem-favorite.css',
})
export class MemFavorite {
  //#region 網頁載入時拿教練卡片資料
  //準備一個空籃子放 API 回傳的教練陣列
  fav: any[] = [];
  isLoading = false;
  isEnd = false;
  currentPage = 1;
  //注入HttpClient
  constructor(private client: HttpClient) { }

  ngOnInit(): void {
    this.getMyFav();
  }
  getMyFav() {
    if (this.isLoading || this.isEnd) return; // 防止重複點擊
    this.isLoading = true; // 開始轉圈圈/秀骨架

    //把 URL 改成動態的，把 currentPage 傳給後端
    this.client.get<any[]>(`https://localhost:7017/api/Exp/Exp/myFavList{id}?page=${this.currentPage}&pageSize=6`).subscribe({
      next: (data) => {
        setTimeout(() => {
          if (data.length < 6) {
            this.isEnd = true;
          }
          //用 ... 把新拿到的 6 個教練，「接」在舊的教練後面
          this.fav = [...this.fav, ...data]; //資料先抓到容器裡
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

}
