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

export class CourseTempList {
  //--------------------------------------//
  @Input() tempData: TempInfoI | null = null;
  //--------------------------------------//

  constructor(
    private courseInfoS: CourseInformationS,

    private route: ActivatedRoute
  ) { }
  //--------------------------------------//


}
