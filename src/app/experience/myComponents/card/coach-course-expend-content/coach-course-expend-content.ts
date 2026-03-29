import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { CourseInfoI } from '../../../Interfaces/course.model';
import { CourseForOneS } from '../../../Service/course-for-one';
//===========!!子 Component!!================//

@Component({
  selector: 'app-coach-course-expend-content',
  imports: [CommonModule],
  templateUrl: './coach-course-expend-content.html',
  styleUrl: './coach-course-expend-content.css',
})
export class CoachCourseExpendContent implements OnInit {
  courses = signal<CourseInfoI[]>([]);
  sessionId: number = 4100002; // 預設的 sessionId，
  //=======================================//
  constructor(private courseS: CourseForOneS) { }
  //=======================================//
  ngOnInit(): void {
    this.loadData(this.sessionId);
  }
  //====方法=================================//
  loadData(sessionId: number) {
    this.courseS.getNameInfo(sessionId).subscribe({
      next: (result) => {
        this.courses.set(result.data ? [result.data] : []); // 把資料放進 courses，這裡假設 API 回傳的 data 是單一 SessionInfoI，如果是陣列就直接 set(result.data)
      },
      error: (err) => {
        console.error('Error fetching session info:', err);
      }
    });
  }
  buy() {
    // 處理購買邏輯
  }
}
