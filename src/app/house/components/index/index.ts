import { CityGroupDTO, HouseListDTO } from './../../interface/ihouse';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { HouseService } from '../../service/index-service';
import { DragScroll } from '../../directives/drag-scroll';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  imports: [CommonModule, DecimalPipe, RouterLink, DragScroll],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index implements OnInit {

  cityGroups: CityGroupDTO[] = [];
  houseGroups: CityGroupDTO[] = [];
  selectedCity: string = '全部';
  cities: string[] = ['全部'];

  constructor(public houseService: HouseService, private router: Router) { }

  SearchHouses(event: Event) {
    event.stopPropagation();
    const totalGuests = this.houseService.adultCount + this.houseService.childCount;
    this.router.navigate(['/searchHouse'], {
      queryParams:
      {
        city: this.selectedCity,
        guests: totalGuests
      }
    });
  }


  ngOnInit(): void {

    // 這是抓「下拉選單」用的城市名稱
    this.houseService.getCities().subscribe({
      next: (data) => {
        // 把資料庫撈回來的 ['宜蘭縣', '台北市'] 接在 '全部' 後面
        this.cities = ['全部', ...data];
        console.log('成功載入城市選單：', this.cities);
      },
      error: (err) => console.error('載入城市選單失敗：', err)
    });

    this.loadHouses();
  }


  // 封裝載入邏輯，方便重複呼叫
  loadHouses(city?: string): void {
    this.houseService.getHouseGroups(city).subscribe({
      next: (data) => {
        this.houseGroups = data;
        this.cityGroups = data;
      },
      error: (err) => console.error('讀取房源失敗', err)
    });
  }

  // 當使用者點擊城市標籤
  filterByCity(city: string): void {
    this.selectedCity = city;
    this.loadHouses(city);
  }

  openCalendar(event: Event) {
    console.log('點擊成功');
    event.stopPropagation();
    // 加上 event: Event 並調用 stopPropagation()
    // 可以防止點擊時間的時候，地點建議的下拉選單也跑出來攪局
    const modal = document.getElementById('calendar_modal') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }

  openGuest(event: Event) {
    event.stopPropagation();
    const modal = document.getElementById('guest_modal') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }

  formatImg(url: string) {
    return this.houseService.getCloudinaryThumb(url);
  }

  // 1. 單純選擇城市，但不立刻跳轉（讓使用者選完地點還可以選人數）
  selectCity(city: string) {
    this.selectedCity = city;
    // 讓 Dropdown 自動收起來 (利用 activeElement 失去焦點)
    (document.activeElement as HTMLElement).blur();
  }

  // 2. 點擊放大鏡才真正執行 API 搜尋
  searchHouses(event: Event) {
    event.stopPropagation(); // 防止觸發到父層的 openGuest
    const totalGuests = this.houseService.adultCount + this.houseService.childCount;
    // 呼叫你寫好的 Service
    this.loadHouses(this.selectedCity);
    this.router.navigate(['/searchHouse'], {
      queryParams: {
        city: this.selectedCity,
        guests: totalGuests
      }
    });
  }
}
