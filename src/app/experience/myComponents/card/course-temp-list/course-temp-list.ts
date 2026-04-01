import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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

export class CourseTempList {
  course: CourseInfoI | null = null;
  //--------------------------------------//
  constructor(private courseInfoS: CourseInformationS,
    private router: Router
  ) { }
  //--------------------------------------//


  onEditTemplate() {
    this.router.navigate(['/'])
    console.log('開啟模板編輯器...');
  }

  onSchedule() {
    console.log('跳轉至排程頁面...');
  }
}
