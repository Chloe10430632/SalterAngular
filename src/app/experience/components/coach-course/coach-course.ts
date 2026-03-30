import { Component } from '@angular/core';
import { Withavatar } from "../../myComponents/container/withavatar/withavatar";
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Footer } from "../../../shared/footer/footer";

@Component({
  selector: 'app-coach-course',
  imports: [Withavatar, LittleIsland, Footer],
  templateUrl: './coach-course.html',
  styleUrl: './coach-course.css',
})
export class CoachCourse {

}
