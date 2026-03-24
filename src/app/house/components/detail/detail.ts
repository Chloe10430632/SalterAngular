import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class Detail implements OnInit {

  selectedProperty: any;
  isLoading = true;
  currentSlideIndex = 0;

  constructor(private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getHouseDetail(id);
    }
  }

  getHouseDetail(id: string) {
    this.http.get<any>(`https://localhost:7017/api/Home/${id}`).subscribe({
      next: (data) => {
        //這裡吧API資料存入變數
        this.selectedProperty = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.log('API Error:', err);
        this.isLoading = false;
      }
    })
  }

  // 計算平均評分
  getAverageRating(): string {
    const reviews = this.selectedProperty?.reviews;
    if (!reviews || reviews.length === 0) return '0.0';
    const total = reviews.reduce((sum: number, rv: any) => sum + rv.rating, 0);
    return (total / reviews.length).toFixed(1);
  }

  // 圖片輪播控制
  scrollIntoView(index: number) {
    this.currentSlideIndex = index;
    const id = 'slide' + index;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' });
    }
  }

  // 這兩個方法用來計算上一張和下一張的索引，讓輪播能無限循環
  getPrevIndex(): number {
    const total = this.selectedProperty?.allImages?.length || 0;
    return (this.currentSlideIndex === 0 ? total - 1 : this.currentSlideIndex - 1);
  }
  getNextIndex(): number {
    const total = this.selectedProperty?.allImages?.length || 0;
    return (this.currentSlideIndex === total - 1) ? 0 : this.currentSlideIndex + 1;
  }
}
