import { CoursePublish } from './../../myComponents/card/course-publish/course-publish';
import { Component, OnInit, signal } from '@angular/core';
import { Calender } from "../../myComponents/calender/calender";
import { CourseSessionInfoI } from '../../Interfaces/IICourse';
import { CommonModule, DatePipe } from '@angular/common';
import { CourseInformationS } from '../../Service/course-information';
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Footer } from "../../../shared/footer/footer";
import { AuthStore } from '../../Service/auth-store';
import { ActivatedRoute } from '@angular/router';


//這是 父 //
//==================這是月曆================//

@Component({
  selector: 'app-coach-more-course-calendar',
  imports: [Calender, CommonModule, CoursePublish, LittleIsland, Footer],
  templateUrl: './coach-more-course-calendar.html',
  styleUrl: './coach-more-course-calendar.css',
})
export class CoachMoreCourseCalendar implements OnInit {
  dailyCourses: CourseSessionInfoI[] = [];
  selectDate: string = "";
  markCourses: CourseSessionInfoI[] = [];
  markedDates: string[] = [];
  isLoggedIn = signal(false);
  coachId: number = 0;
  //------------------//
  constructor(private courseS: CourseInformationS,
    private authS: AuthStore,
    private route: ActivatedRoute
  ) { }
  //------------------//
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.coachId = +params['id']; // 把字串轉成數字
      console.log("從網址抓到的教練ID:", this.coachId);

      if (this.coachId) {
        // 1. 載入該教練所有有課的日期 (用來在月曆畫點點)
        this.loadMarkedDates();

        // 2. 預設載入今天的課程
        const today = new Date().toISOString().split('T')[0];
        this.selectDate = today;
        this.loadCoursesByDate(today);
      }
    });

    this.isLoggedIn.set(!!localStorage.getItem('token'));
  }

  //------------------//

  dateSelected(dateStr: string) {
    const d = new Date(dateStr);
    // 手動格式化，避開時區轉換導致的日期跳掉
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    this.selectDate = `${year}-${month}-${day}`;
    this.loadCoursesByDate(this.selectDate);
    console.log("最終發送給 API 的日期:", this.selectDate);
  }
  loadMarkedDates() {
    this.courseS.getCoachCourseDates(this.coachId).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.markedDates = res.data; // 確保這裡拿到的資料格式是 string[]
          console.log("這名教練有課的日期：", this.markedDates);
        }
      }
    });
  }
  loadCoursesByDate(day: string) {
    this.courseS.getCoursesByDate(this.coachId, day).subscribe({
      next: (res) => {
        // res 是 APIResponse<CourseSessionInfoI[]>，要取 .data
        this.dailyCourses = res.data ?? [];
        console.log("父:", res);
      },
      error: (err) => {
        console.error(err);
        this.dailyCourses = [];
      }
    });
  }

  onRemoveCourse(sessionId: number) {
    this.dailyCourses = this.dailyCourses.filter(c => c.sessionId !== sessionId);
  }
}

