import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-attend-course-card',
  imports: [],
  templateUrl: './attend-course-card.html',
  styleUrl: './attend-course-card.css',
})
export class AttendCourseCard {
  @Input() courseData = {
    name: '基礎瑜伽',
    coach: '王小明',
    date: '2023-10-26',
    time: '14:00 - 15:30',
    level: '初級',
    location: '健身房 A',
    price: 500,
    rating: 4.8,
    review: '教練非常細心，動作講解清楚，非常適合像我這樣的初學者。'
  };
}
