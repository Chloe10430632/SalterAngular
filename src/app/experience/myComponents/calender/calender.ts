import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

//這是 子 //
//小月曆殼//

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
  selectedDateStr: string = ''; // 選中的日期
  days: CalendarDay[] = [];
  weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  //----------------------//
  @Input() markedDates: string[] = [];
  @Output() dateSelected = new EventEmitter<string>();
  //----------------------//
  ngOnInit() {
    const today = new Date();
    this.selectedDateStr = this.formatDate(today);
    this.generateCalendar();
    this.dateSelected.emit(this.selectedDateStr);
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
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  selectDate(day: CalendarDay) {
    if (day.isCurrentMonth) {
      this.selectedDateStr = day.fullDate;
      this.dateSelected.emit(day.fullDate)
    }
  }

  // 切換月份
  changeMonth(delta: number) {
    this.viewDate = new Date(this.viewDate.setMonth(this.viewDate.getMonth() + delta));
    this.generateCalendar();
  }

}
