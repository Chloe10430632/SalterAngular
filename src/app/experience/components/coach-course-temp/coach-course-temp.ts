import { NotificationService } from './../../../shared/notifyService/notification-service';
import { TempInfoI } from './../../Interfaces/IICourse';
import { Component, OnInit } from '@angular/core';
import { Withavatar } from "../../myComponents/container/withavatar/withavatar";
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Footer } from "../../../shared/footer/footer";
import { Toptab } from "../../myComponents/btn/toptab/toptab";
import { CourseTempList } from "../../myComponents/card/course-temp-list/course-temp-list";
import { Router } from '@angular/router';
import { CourseInformationS } from '../../Service/course-information';

//===============!!這是父 元件!!=======================//
//===============!! 課程模板 !!=======================//


@Component({
  selector: 'app-coach-course-temp',
  imports: [Withavatar, LittleIsland, Footer, CourseTempList],
  templateUrl: './coach-course-temp.html',
  styleUrl: './coach-course-temp.css',
})
export class CoachCourseTemp implements OnInit {
  tempList: TempInfoI[] = []
  //-----------------------//
  constructor(private courseInfoS: CourseInformationS,
    public notificatS: NotificationService
  ) { }
  //-----------------------//
  ngOnInit(): void {
    this.loadMyTemp();
  }
  //-----------------------//
  loadMyTemp() {
    this.courseInfoS.getCourseT().subscribe({
      next: (result) => {
        if (result.isSuccess) {
          this.tempList = result.data; // 確保變數名稱一致
          console.log('成功抓到模板：', this.tempList);
        } else {
          console.error('後端回傳失敗：', result.message);
        }
      },
      error: (err) => console.error('API 連線失敗：', err)
    });
  }

}
