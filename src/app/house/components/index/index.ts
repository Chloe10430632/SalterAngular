import { CityGroupDTO, } from './../../interface/ihouse';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { HouseService } from '../../service/index-service';
import { DragScroll } from '../../directives/drag-scroll';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-index',
  imports: [CommonModule, DecimalPipe, RouterLink, DragScroll, FormsModule],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index implements OnInit {

  cityGroups: CityGroupDTO[] = [];
  houseGroups: CityGroupDTO[] = [];
  selectedCity: string = '全部';
  cities: string[] = ['全部'];
  today: string = new Date().toISOString().split('T')[0];
  startDate: string = '';
  endDate: string = '';


  constructor(public houseService: HouseService, private router: Router) { }

  SearchHouses(event: Event) {
    event.stopPropagation();
    const totalGuests = this.houseService.adultCount + this.houseService.childCount;
    this.router.navigate(['/searchHouse'], {
      queryParams:
      {
        city: this.selectedCity,
        guests: totalGuests,
        startDate: this.startDate,
        endDate: this.endDate
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
    //自動清空搜尋欄的欄位
    this.houseService.adultCount = 0;
    this.houseService.childCount = 0;
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

    // 1. 先執行原本的 blur
    const currentElement = document.activeElement as HTMLElement;
    if (currentElement) {
      currentElement.blur();
    }

    // 2. 強制把所有 dropdown-content 藏起來（針對 DaisyUI 特性）
    const dropdowns = document.querySelectorAll('.dropdown-content') as NodeListOf<HTMLElement>;
    dropdowns.forEach(el => {
      el.style.display = 'none'; // 瞬間消失
      // 0.1 秒後恢復，才不會影響下次滑鼠移入
      setTimeout(() => {
        el.style.removeProperty('display');
      }, 100);
    });
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
        guests: totalGuests,
        startDate: this.startDate,
        endDate: this.endDate
      }
    });
  }

  onStartDateChange() {
    {
      // 如果選了入住日期後，退房日期比它早，就清空退房日期
      if (this.endDate && this.endDate <= this.startDate) {
        this.endDate = '';
      }
    }
  }

  // 清除日期
  clearDates() {
    this.startDate = '';
    this.endDate = '';
  }
}
