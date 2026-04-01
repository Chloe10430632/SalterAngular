import { Component, OnInit, signal } from '@angular/core';
import { MemreviewCard } from "../../myComponents/card/memreview-card/memreview-card";
import { CourseforCoachProfile } from "../../myComponents/card/coursefor-coach-profile/coursefor-coach-profile";
import { ActivatedRoute } from '@angular/router';
import { CoachAllInfoS } from '../../Service/coach-all-info-s';
import { CoachAllInfoI } from '../../Interfaces/coachallinfo';
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Footer } from "../../../shared/footer/footer";
import { CourseExpendDetail } from "../../myComponents/card/course-expend-detail/course-expend-detail";

//========!!這是 父 元件!!================//
//========!!教練小卡+摺疊課程+評論!!================//
//=========CourseforCoachProfile/  /MemreviewCard================//

@Component({
  selector: 'app-coachintro',
  imports: [MemreviewCard, CourseforCoachProfile, LittleIsland, Footer, CourseExpendDetail],
  templateUrl: './coach-intro.html',
  styleUrl: './coach-intro.css',
})
export class Coachintro implements OnInit {
  coachData = signal<CoachAllInfoI | null>(null);
  //--------------------------------------------------------//
  constructor(
    private route: ActivatedRoute, // 用來抓網址上的參數
    private coachInfoS: CoachAllInfoS
  ) { }
  //--------------------------------------------------------//
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    //--------------------------------------------------------//
    if (id) {
      // 2. 拿著 ID 去問 API 要資料
      this.coachInfoS.getCoachInfo(id).subscribe(res => {
        this.coachData.set(res.data); // 把抓到的教練資料存起來
      });
    }

  }



}
