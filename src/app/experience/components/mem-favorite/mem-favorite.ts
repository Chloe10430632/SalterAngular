import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FavCard } from "../../myComponents/card/fav-card/fav-card";
import { Footer } from "../../../shared/footer/footer";
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Noavatar } from "../../myComponents/container/noavatar/noavatar";

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
  currentPage = 1;
  //注入HttpClient
  constructor(private client: HttpClient) { }

  ngOnInit(): void {
    this.getMyFav();
  }

}
