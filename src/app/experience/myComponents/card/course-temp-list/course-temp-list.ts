import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CourseInformationS } from '../../../Service/course-information';
import { CourseInfoI } from '../../../Interfaces/IICourse';
import { Router } from '@angular/router';
//===============!!這是子 元件!!=======================//
//===============!! 課程模板 !!=======================//

@Component({
  selector: 'app-course-temp-list',
  imports: [CommonModule],
  templateUrl: './course-temp-list.html',
  styleUrl: './course-temp-list.css',
})
//========!!這是 子 元件!!================//
//========!!課程模板!!================//

export class CourseTempList implements OnInit {
  course: CourseInfoI | null = null;
  //--------------------------------------//
  constructor(private courseInfoS: CourseInformationS,
    private router: Router
  ) { }
  //--------------------------------------//
  ngOnInit(): void {
    if (this.course?.templateId != null)
      this.loadRemp(this.course?.templateId);
  }
  //--------------------------------------//
  loadRemp(tempId: number) {
    this.courseInfoS.getCourseInfo(id).subscribe({
      next: (result) => {
        if (result.isSuccess) {
          this.course = result.data;
          console.log('抓到課程內容囉：', this.course);
        } else {
          console.error('後端說失敗：', result.message);
        }
      },
      error: (err) => console.error('抓取失敗：', err)
    });
  }
}

//--------------------------------------//

onEditTemplate() {
  this.router.navigate(['/'])
  console.log('開啟模板編輯器...');
}

onSchedule() {
  console.log('跳轉至排程頁面...');
}
}
