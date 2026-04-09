import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // 記得引入，HTML 才能用 @for
import { Withavatar } from "../../myComponents/container/withavatar/withavatar";
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Footer } from "../../../shared/footer/footer";
import { CoursePublish } from "../../myComponents/card/course-publish/course-publish";
import { CourseInformationS } from '../../Service/course-information';
import { NotificationService } from '../../../shared/notifyService/notification-service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; 
import { CourseSessionInfoI } from '../../Interfaces/IICourse';
import { CoachCoursePast } from "../coach-course-past/coach-course-past";
//===============!!這是 父 元件!!==================//
//===============!!上架中!!==================//

@Component({
  selector: 'app-coach-course',
  imports: [Withavatar, LittleIsland, Footer, CoursePublish, CoachCoursePast],
  templateUrl: './coach-course.html',
  styleUrl: './coach-course.css',
})
export class CoachCourse implements OnInit {
  publishedList: CourseSessionInfoI[] = []; // 存從 API 抓回來的已上架清單
  pastList: CourseSessionInfoI[] = [];
  //-------------------------------//
  constructor(
    private courseS: CourseInformationS,
    private notifyS: NotificationService,
    private router: Router
  ) { }
  //-------------------------------//
  ngOnInit(): void {
    this.loadPublishedCourses();
  }
  //-------------------------------//
  loadPublishedCourses() {
    this.courseS.getPublishedSessions().subscribe(res => {
      if (res.isSuccess) {
        // 1. 排序
        const allData = res.data.sort((a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 2. 過濾「上架中」：該課程日期 >= 今天
        this.publishedList = allData.filter(item => {
          if (!item.startDate) return false; // 沒日期就淘汰

          // 直接把 startDate 轉成日期物件
          const courseDate = new Date(item.startDate);
          courseDate.setHours(0, 0, 0, 0);

          return courseDate >= today;
        });

        // 3. 過濾「往期課程」：該課程日期 < 今天
        this.pastList = allData.filter(item => {
          if (!item.startDate) return true; // 沒日期的放往期

          const courseDate = new Date(item.startDate);
          courseDate.setHours(0, 0, 0, 0);

          return courseDate < today;
        });

        console.log('✅ 篩選完成！上架中：', this.publishedList.length, '往期：', this.pastList.length);
      }
    });
  }

  deleteFromDB(sessionId: number) {
    Swal.fire({
      title: '確定要下架嗎？',
      text: "下架後學生將無法看見此時段！",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '確定下架',
      cancelButtonText: '取消'
    }).then((result) => {
      if (result.isConfirmed) {
        // 對應你的 Service: deleteSession(sessionId)
        this.courseS.deleteSession(sessionId).subscribe({
          next: (res) => {
            if (res.isSuccess) {
              this.notifyS.show("下架成功", "success");
              // 畫面同步移除該筆資料
              this.publishedList = this.publishedList.filter(item => item.sessionId !== sessionId);
            }
          },
          error: (err) => {
            console.error(err);
            this.notifyS.show("刪除失敗", "error");
          }
        });
      }
    });
  }
}


