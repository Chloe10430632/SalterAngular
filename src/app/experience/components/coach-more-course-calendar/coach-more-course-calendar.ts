import { CoursePublish } from './../../myComponents/card/course-publish/course-publish';
import { Component } from '@angular/core';
import { Calender } from "../../myComponents/calender/calender";
import { CourseSessionInfoI } from '../../Interfaces/IICourse';
import { DatePipe } from '@angular/common';
import { CourseInformationS } from '../../Service/course-information';


//這是 父 //
//==================這是月曆================//

@Component({
  selector: 'app-coach-more-course-calendar',
  imports: [Calender],
  templateUrl: './coach-more-course-calendar.html',
  styleUrl: './coach-more-course-calendar.css',
})
export class CoachMoreCourseCalendar {

  dailyCourses: CourseSessionInfoI[] = [];
  selectedDate = Number(Date.now);
  weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  calendarDays = [22, 23, 24, 25, 26, 27, 28]; // 模擬一週
  //-------------------------------------------------------//
  constructor(private courseS: CourseInformationS) { }
  //-------------------------------------------------------//
  selectDate(day: number) {
    this.selectedDate = day;
    this.loadCoursesByDate(day);
  }
  loadCoursesByDate(id: number) {
    // 這裡打 API，帶日期參數
    this.courseS.getCourseInfo(id).subscribe({
      next: (res) => {
        this.dailyCourses.startDate = this.res;
      }
    })
  }
  onRemoveCourse(sessionId: number) {
    // 呼叫 API 下架，成功後重新撈當天課程
    this.dailyCourses = this.dailyCourses.filter(c => c.sessionId !== sessionId);
  }
}

