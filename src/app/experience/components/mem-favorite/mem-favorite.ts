import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FavCard } from "../../myComponents/card/fav-card/fav-card";
import { Footer } from "../../../shared/footer/footer";
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Noavatar } from "../../myComponents/container/noavatar/noavatar";
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-coach-favorite',
  imports: [FavCard, Footer, LittleIsland, Noavatar,],
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
    this.client.get<any>(`${environment.apiUrl}/Exp/Exp/myFavList?page=${this.currentPage}&pageSize=6`).subscribe({
      next: (result) => {
        setTimeout(() => {
          const newData = result.data;

          if (!newData || newData.length < 6) {
            this.isEnd = true; // 抓回來的比 6 筆少，代表沒貨了
          }

          if (newData && newData.length > 0) {
            this.fav = [...this.fav, ...newData]; // 把新教練接在後面
            this.currentPage++; // 下次要抓下一頁
          }

          this.isLoading = false;
        }, 1500);
      },
      error: (err) => {
        console.error('API 壞掉啦', err);
        this.isLoading = false;
      }
    });
  }
  //#endregion

  handleRemove(coachId: number) {
    // 用 filter 濾掉被點擊的那位教練
    this.fav = this.fav.filter(c => c.coachId !== coachId);
  }
}
