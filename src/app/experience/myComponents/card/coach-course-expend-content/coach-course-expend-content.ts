import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { CourseInfoI } from '../../../Interfaces/IICourse';
import { CourseInformationS } from '../../../Service/course-information';
//===========!!子 Component!!================//
//========!!課程折疊!!================//
//========!!放在教練介紹、上架中課程!!================//


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
  constructor(private courseS: CourseInformationS) { }
  //=======================================//
  ngOnInit(): void {
    this.loadData(this.sessionId);
  }
  //====方法=================================//
  loadData(sessionId: number) {
    this.courseS.getCourseInfo(sessionId).subscribe({
      next: (result) => {
        this.courses.set(result ? [result] : []); // 把資料放進 courses，這裡假設 API 回傳的 data 是單一 SessionInfoI，如果是陣列就直接 set(result.data)
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
