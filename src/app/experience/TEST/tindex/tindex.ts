import { Component } from '@angular/core';
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Footer } from "../../../shared/footer/footer";
import { Calender } from "../../myComponents/calender/calender";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tindex',
  imports: [LittleIsland, Footer, Calender, DatePipe],
  templateUrl: './tindex.html',
  styleUrl: './tindex.css',
})
export class Tindex {
viewDate: Date = new Date(2026, 2); // 2026年3月
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  selectedDateStr = '2026-03-29';

  // 模擬海邊活動資料
  courseData: any = {
    '2026-03-29': [
      { id: 1, time: '09:00 - 11:00', title: '晨曦衝浪入門課', spots: 5, content: '在金色的陽光下學習如何划水與起乘，適合完全沒有經驗的新手。' },
      { id: 2, time: '13:30 - 15:30', title: '秘密礁岩浮潛探險', spots: 0, content: '探索隱藏在海灣角落的珊瑚礁，觀察豐富的熱帶魚群。' },
      { id: 3, time: '16:00 - 18:00', title: '沙灘排球對抗賽', spots: 12, content: '在夕陽餘暉下揮灑汗水，享受熱血的團隊競賽，結束後有沙灘派對！' }
    ],
    '2026-03-30': [
      { id: 4, time: '10:00 - 12:00', title: '立槳板 (SUP) 巡航', spots: 3, content: '平靜海域上的悠閒時光，鍛鍊核心同時欣賞海岸線美景。' }
    ]
  };

  days: any[] = [];
  dailyCourses: any[] = [];

  ngOnInit() {
    this.generateCalendar();
    this.updateDailyCourses();
  }

  generateCalendar() {
    // 簡單生成 3 月份的日期（僅供範例展示）
    this.days = [];
    for (let i = 1; i <= 31; i++) {
      const fullDate = `2026-03-${i.toString().padStart(2, '0')}`;
      this.days.push({ date: i, fullDate });
    }
  }

  selectDate(day: any) {
    this.selectedDateStr = day.fullDate;
    this.updateDailyCourses();
  }

  updateDailyCourses() {
    this.dailyCourses = this.courseData[this.selectedDateStr] || [];
  }

  changeMonth(offset: number) {
    // 這裡可以實作切換月份邏輯
    console.log('切換月份:', offset);
  }
}
