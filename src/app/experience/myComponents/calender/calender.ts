import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  fullDate: string; // 用於比對課程日期
}

@Component({
  selector: 'app-calender',
  imports: [DatePipe],
  templateUrl: './calender.html',
  styleUrl: './calender.css',
})
export class Calender implements OnInit {
  viewDate = new Date(); // 目前查看的日期
  selectedDateStr: string = ''; // 選中的日期字串 (YYYY-MM-DD)
  days: CalendarDay[] = [];
  weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  // 模擬課程數據，使用日期作為 Key
  courseData: { [key: string]: any[] } = {
    '2026-03-24': [
      { id: 1, time: '10:00', title: '進階瑜珈', spots: 5, content: '...' },
      { id: 2, time: '14:00', title: '核心訓練', spots: 0, content: '...' }
    ],
    '2026-03-26': [
      { id: 3, time: '19:00', title: '晚間冥想', spots: 2, content: '...' }
    ]
  };

  ngOnInit() {
    const today = new Date();
    this.selectedDateStr = this.formatDate(today);
    this.generateCalendar();
  }

  generateCalendar() {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();

    // 該月第一天與最後一天
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

    const tempDays: CalendarDay[] = [];

    // 1. 填充月初的空白 (前一個月)
    for (let i = 0; i < firstDayOfMonth; i++) {
      tempDays.push({ date: 0, isCurrentMonth: false, fullDate: '' });
    }

    // 2. 填充本月日期
    for (let i = 1; i <= lastDateOfMonth; i++) {
      tempDays.push({
        date: i,
        isCurrentMonth: true,
        fullDate: this.formatDate(new Date(year, month, i))
      });
    }

    this.days = tempDays;
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  selectDate(day: CalendarDay) {
    if (day.isCurrentMonth) {
      this.selectedDateStr = day.fullDate;
    }
  }

  // 切換月份
  changeMonth(delta: number) {
    this.viewDate = new Date(this.viewDate.setMonth(this.viewDate.getMonth() + delta));
    this.generateCalendar();
  }

  // 取得選中日期的課程
  get currentCourses() {
    return this.courseData[this.selectedDateStr] || [];
  }
}
