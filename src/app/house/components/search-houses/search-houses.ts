import { ActivatedRoute, Route, RouterLink, RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HousePreviewDTO } from '../../interface/ihouse';
import { HouseService } from '../../service/index-service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-search-houses',
  imports: [DecimalPipe, RouterModule],
  templateUrl: './search-houses.html',
  styleUrl: './search-houses.css',
})
export class SearchHouses implements OnInit {

  results: HousePreviewDTO[] = [];
  currentCity: string = '';

  constructor(public houseService: HouseService, private route: ActivatedRoute) { }


  ngOnInit(): void {
    // 監聽網址 queryParams 的變化

    this.route.queryParams.subscribe(params => {
      console.log('【Debug】SearchHouses 接收到的參數：', params);
      this.currentCity = params['city'] || '全部';
      const guests = params['guests'] ? Number(params['guests']) : undefined;
      const startDate = params['startDate'];
      const endDate = params['endDate'];
      this.loadSearchResults(this.currentCity, guests, startDate, endDate); // 參數一變就重新抓資料
    });
  }
  loadSearchResults(city: string, guests?: number, start?: string, end?: string) {
    // 這裡呼叫你之前寫好的 SearchHousesAsync 對應的 API
    this.houseService.getSearchHouses(city, guests, start, end).subscribe({
      next: (data) => this.results = data,
      error: (err) => console.error(err)
    });
  }
}
