import { Component } from '@angular/core';
import { MemreviewCard } from "../../myComponents/card/memreview-card/memreview-card";
import { CourseforCoachProfile } from "../../myComponents/card/coursefor-coach-profile/coursefor-coach-profile";

@Component({
  selector: 'app-coachintro',
  imports: [  MemreviewCard, CourseforCoachProfile],
  templateUrl: './coach-intro.html',
  styleUrl: './coach-intro.css',
})
export class Coachintro {
 
  // 模擬數據
  reviews = [
    { userId: 'User_Alex99', stars: 5, comment: '老師教學非常細心，動作講解的很清楚！' },
    { userId: 'FitnessLover', stars: 4, comment: '課程強度適中，非常有收穫。' },
    { userId: 'HealthyLife', stars: 5, comment: '非常有耐心的教練，推推！' }
  ];

  // 計算平均分數 (取至小數點第一位)



}
