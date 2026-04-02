import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CourseInformationS } from '../../../Service/course-information';
import { CourseSessionInfoI, TempInfoI } from '../../../Interfaces/IICourse';
import { ActivatedRoute, Router } from '@angular/router';
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
  course: CourseSessionInfoI | null = null;
  template: TempInfoI | null = null;
  //--------------------------------------//
  constructor(private courseInfoS: CourseInformationS,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  //--------------------------------------//
  ngOnInit(): void {
    //從路由抓id
    const idFromUrl = this.route.snapshot.paramMap.get('id');

    if (idFromUrl) {
      // 網址抓到的是字串，我們要轉成數字餵給 Service
      this.loadTemp(Number(idFromUrl));
    } else {
      console.warn('網址上找不到課程 ID 喔！');
    }
  }
  //--------------------------------------//
  loadTemp(tempId: number) {
    this.courseInfoS.getCourseT(tempId).subscribe({
      next: (result) => {
        if (result.isSuccess) {
          this.template = result.data;
          console.log('抓到模板內容囉：', this.course);
        } else {
          console.error('後端說失敗：', result.message);
        }
      },
      error: (err) => console.error('抓取失敗：', err)
    });
  }
}

//--------------------------------------//

// onEditTemplate() {
//   this.router.navigate(['/'])
//   console.log('開啟模板編輯器...');
// }

// onSchedule() {
//   console.log('跳轉至排程頁面...');
// }}

