import { Component } from '@angular/core';
import { AttendCourseCard } from "../../myComponents/card/attend-course-card/attend-course-card";
import { Footer } from "../../../shared/footer/footer";
import { LittleIsland } from "../../myComponents/little-island/little-island";

@Component({
  selector: 'app-mem-attend',
  imports: [AttendCourseCard, Footer, LittleIsland],
  templateUrl: './mem-attend.html',
  styleUrl: './mem-attend.css',
})
export class MemAttend {

}
