import { Component } from '@angular/core';
import { Withavatar } from "../../myComponents/container/withavatar/withavatar";
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Footer } from "../../../shared/footer/footer";
import { Toptab } from "../../myComponents/btn/toptab/toptab";
import { CourseTempList } from "../../myComponents/card/course-temp-list/course-temp-list";

//===============!!這是父 元件!!=======================//
//===============!! 課程模板 !!=======================//


@Component({
  selector: 'app-coach-course-temp',
  imports: [Withavatar, LittleIsland, Footer, CourseTempList],
  templateUrl: './coach-course-temp.html',
  styleUrl: './coach-course-temp.css',
})
export class CoachCourseTemp {

}
