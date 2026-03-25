import { ActivatedRoute, Route } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HousePreviewDTO } from '../../interface/ihouse';
import { HouseService } from '../../service/index-service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-search-houses',
  imports: [DecimalPipe],
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
      this.currentCity = params['city'] || '全部';
      this.loadSearchResults(); // 參數一變就重新抓資料
    });
  }
  loadSearchResults() {
    // 這裡呼叫你之前寫好的 SearchHousesAsync 對應的 API
    this.houseService.getSearchHouses(this.currentCity).subscribe({
      next: (data) => this.results = data,
      error: (err) => console.error(err)
    });
  }
}
