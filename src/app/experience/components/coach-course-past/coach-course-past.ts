import { CoursePublish } from './../../myComponents/card/course-publish/course-publish';
import { Component, Input, OnInit } from '@angular/core';
import { Withavatar } from "../../myComponents/container/withavatar/withavatar";
import { CourseSessionInfoI } from '../../Interfaces/IICourse';
import { CourseInformationS } from '../../Service/course-information';
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Footer } from "../../../shared/footer/footer";

@Component({
  selector: 'app-coach-course-past',
  imports: [Withavatar, CoursePublish, LittleIsland, Footer],
  templateUrl: './coach-course-past.html',
  styleUrl: './coach-course-past.css',
})
export class CoachCoursePast implements OnInit {
  pastList: CourseSessionInfoI[] = [];
  //-------------------------------//

  constructor(private courseS: CourseInformationS) { }
  //-------------------------------//
  ngOnInit(): void {
    this.loadPastCourses();
  }
  //-------------------------------//
  loadPastCourses() {
    this.courseS.getPublishedSessions().subscribe(res => {
      if (res.isSuccess) {
        // 1. 排序
        const allData = res.data.sort((a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // 3. 過濾「往期課程」：該課程日期 < 今天
        this.pastList = allData.filter(item => {
          if (!item.startDate) return false;

          const courseDate = new Date(item.startDate);
          courseDate.setHours(0, 0, 0, 0);

          return courseDate < today;
        });

        console.log(this.pastList.length);
      }
    });
  }

}

