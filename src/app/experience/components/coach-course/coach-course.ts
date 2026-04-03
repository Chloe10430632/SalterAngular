import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // 記得引入，HTML 才能用 @for
import { Withavatar } from "../../myComponents/container/withavatar/withavatar";
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Footer } from "../../../shared/footer/footer";
import { CoursePublish } from "../../myComponents/card/course-publish/course-publish";
import { CourseInformationS } from '../../Service/course-information';
import { NotificationService } from '../../../shared/notifyService/notification-service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // 1. 引入 SweetAlert2
import { CourseSessionInfoI } from '../../Interfaces/IICourse';
//===============!!這是 父 元件!!==================//
//===============!!上架中!!==================//

@Component({
  selector: 'app-coach-course',
  imports: [Withavatar, LittleIsland, Footer, CoursePublish],
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
        const allData = res.data;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // 2. 過濾「上架中」：最後一天 >= 今天
        this.publishedList = allData.filter(item => {
          // 安全檢查：確保有日期
          if (!item.selectedDates || item.selectedDates.length === 0) return false;

          // 取得最後一天並強行將時間重置為午夜，避免「小時/分鐘」干擾比較
          const lastDate = new Date(item.selectedDates[item.selectedDates.length - 1]);
          lastDate.setHours(0, 0, 0, 0);
          return lastDate >= today;
        });

        // 3. 過濾「往期課程」：最後一天 < 今天
        // 記得在元件上方宣告 pastList: CourseSessionInfoI[] = [];
        this.pastList = allData.filter(item => {
          if (!item.selectedDates || item.selectedDates.length === 0) return true;

          const lastDate = new Date(item.selectedDates[item.selectedDates.length - 1]);
          lastDate.setHours(0, 0, 0, 0);
          return lastDate < today;
        });
        console.log('✅ 篩選完成！上架中數量：', this.publishedList.length);
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


