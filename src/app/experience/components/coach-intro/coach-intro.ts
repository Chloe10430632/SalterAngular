import { Component } from '@angular/core';
import { MemreviewCard } from "../../myComponents/card/memreview-card/memreview-card";
import { CourseforCoachProfile } from "../../myComponents/card/coursefor-coach-profile/coursefor-coach-profile";
import { CoachCourseExpendContent } from "../../myComponents/card/coach-course-expend-content/coach-course-expend-content";

@Component({
  selector: 'app-coachintro',
  imports: [MemreviewCard, CourseforCoachProfile, CoachCourseExpendContent],
  templateUrl: './coach-intro.html',
  styleUrl: './coach-intro.css',
})
export class Coachintro {

}
