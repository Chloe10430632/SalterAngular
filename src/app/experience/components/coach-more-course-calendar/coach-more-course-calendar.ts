import { CoursePublish } from './../../myComponents/card/course-publish/course-publish';
import { Component, OnInit, signal } from '@angular/core';
import { Calender } from "../../myComponents/calender/calender";
import { CourseSessionInfoI } from '../../Interfaces/IICourse';
import { CommonModule, DatePipe } from '@angular/common';
import { CourseInformationS } from '../../Service/course-information';
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Footer } from "../../../shared/footer/footer";


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
  isLoggedIn = signal(false);
  coachId: number = 0;
  //------------------//
  constructor(private courseS: CourseInformationS) { }
  //------------------//
  ngOnInit(): void {
    this.isLoggedIn.set(!!localStorage.getItem('token'));
  }
  //------------------//
  dateSelected(dateStr: string) {
    this.selectDate = dateStr;
    this.loadCoursesByDate(dateStr);
  }
  loadCoursesByDate(day: string) {
    this.courseS.getCoursesByDate(this.coachId, day).subscribe({
      next: (res) => {
        // res 是 APIResponse<CourseSessionInfoI[]>，要取 .data
        this.dailyCourses = res.data ?? [];
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

