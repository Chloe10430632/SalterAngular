import { Component } from '@angular/core';
import { Calender } from "../../myComponents/calender/calender";

interface Course {
  id: number;
  time: string;
  title: string;
  content: string;
  spots: number; // 剩餘名額
}

@Component({
  selector: 'app-coach-more-course-calendar',
  imports: [Calender],
  templateUrl: './coach-more-course-calendar.html',
  styleUrl: './coach-more-course-calendar.css',
})
export class CoachMoreCourseCalendar {
  selectedDate = 24;
  weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  calendarDays = [22, 23, 24, 25, 26, 27, 28]; // 模擬一週

  dailyCourses: Course[] = [
    { id: 1, time: '10:00 - 11:30', title: '進階瑜珈流動', content: '深入練習呼吸法與倒立動作。', spots: 5 },
    { id: 2, time: '14:00 - 15:30', title: '核心強化訓練', content: '高強度間歇訓練，專注於腹部與背部。', spots: 0 },
    { id: 3, time: '19:00 - 20:30', title: '晚間冥想拉伸', content: '放鬆壓力，透過慢速拉伸進入深層睡眠。', spots: 3 }
  ];

  selectDate(day: number) {
    this.selectedDate = day;
  }
}

