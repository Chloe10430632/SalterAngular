import { HouseListDTO } from './../../interface/ihouse';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { HouseService } from '../../service/index-service';

@Component({
  selector: 'app-index',
  imports: [CommonModule, DecimalPipe, RouterLink],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index implements OnInit {

  adultCount: number = 0;
  childCount: number = 0;
  houses: HouseListDTO[] = [];
  constructor(private houseService: HouseService) { }

  ngOnInit(): void {
    // 組件初始化時，去叫 Service 抓資料
    this.houseService.getHouses().subscribe({
      next: (data) => {
        this.houses = data;
        console.log('成功抓到房源資料：', this.houses);
      },
      error: (err) => {
        console.error('API 連線失敗：', err);
      }
    });
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


  changeAdult(delta: number) {
    this.adultCount += delta;
    if (this.adultCount < 0) this.adultCount = 0; // 防止變成負數
  }

  changeChild(delta: number) {
    this.childCount += delta;
    if (this.childCount < 0) this.childCount = 0;
  }


}
