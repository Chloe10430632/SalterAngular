import { Component, OnDestroy, OnInit } from '@angular/core';


//================!! 子 元件!!==============================//
//================課程折疊==================================//

@Component({
  selector: 'app-course-expend-detail',
  imports: [],
  templateUrl: './course-expend-detail.html',
  styleUrl: './course-expend-detail.css',
  standalone: true
})
export class CourseExpendDetail implements OnInit, OnDestroy {
  defaultImage: string = "https://res.cloudinary.com/dnqawxc59/image/upload/v1774946867/default_uqfin9.jpg";

  //--------------------------------------------//
  constructor() { }
  //--------------------------------------------//

  course = {
    title: '深度 Angular 實戰營 - DaisyUI 進階應用',
    images: [
      'https://picsum.photos/id/1/300/200',
      'https://picsum.photos/id/2/300/200',
      'https://picsum.photos/id/3/300/200'
    ],
    timeSlot: '每週六 09:00 - 12:00',
    price: 3200,
    description: '這門課程將帶領你從零開始，利用 Tailwind CSS 與 DaisyUI 打造具備專業質感的 Angular 網頁應用程式。',
    enrolled: 18,
    capacity: 25,
    lastUpdated: '2024-05-20'
  };

  activeSlide = 0;
  private slideInterval: any;

  ngOnInit() {
    // 實作 1.5 秒自動輪播邏輯
    this.slideInterval = setInterval(() => {
      this.activeSlide = (this.activeSlide + 1) % this.course.images.length;
    }, 1500);
  }

  ngOnDestroy() {
    if (this.slideInterval) clearInterval(this.slideInterval);
  }

  get isFull(): boolean {
    return this.course.enrolled >= this.course.capacity;
  }
}
