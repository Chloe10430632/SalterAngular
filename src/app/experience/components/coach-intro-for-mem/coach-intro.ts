import { RecommandS } from './../../Service/recommand';
import { CoachS } from './../../Service/coach-s';
import { Component, OnInit, signal } from '@angular/core';
import { MemreviewCard } from "../../myComponents/card/memreview-card/memreview-card";
import { CourseforCoachProfile } from "../../myComponents/card/coursefor-coach-profile/coursefor-coach-profile";
import { ActivatedRoute } from '@angular/router';
import { CoachAllInfoI } from '../../Interfaces/IIcoachAllinfo';
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Footer } from "../../../shared/footer/footer";
import { CourseExpendDetail } from "../../myComponents/card/course-expend-detail/course-expend-detail";
import { UserService } from '../../../user/Services/user-service';
import { ReviewI } from '../../Interfaces/IIreview';
import { ReviewsS } from '../../Service/reviews';
import { AllReviews } from "../../myComponents/card/all-reviews/all-reviews";
import { CoachRecommand } from '../../myComponents/card/coach-recommand/coach-recommand';


//========!!這是 父 元件!!================//
//========!!教練小卡+摺疊課程+評論!!================//
//=========CourseforCoachProfile/  /MemreviewCard================//

@Component({
  selector: 'app-coachintro',
  imports: [MemreviewCard, CourseforCoachProfile, LittleIsland, Footer, CourseExpendDetail, AllReviews, CoachRecommand],
  templateUrl: './coach-intro.html',
  styleUrl: './coach-intro.css',
})
export class Coachintro implements OnInit {
  coachId: number = 0;
  coachData = signal<CoachAllInfoI | null>(null);
  reviews = signal<ReviewI[]>([]);
  isLoggedIn = signal(false);
  allReviews = signal<ReviewI[]>([]);
  recommendList: CoachAllInfoI[] = [];
  //--------------------------------------------------------//
  constructor(
    private route: ActivatedRoute, // 用來抓網址上的參數
    private coachS: CoachS,
    private reviewS: ReviewsS,
    private recommandS: RecommandS,
    public userS: UserService,
  ) { }
  //--------------------------------------------------------//
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoggedIn.set(!!localStorage.getItem('token'));

    if (id) {
      this.coachId = id;
      // 抓教練基本資料
      this.coachS.getCoachInfoNum(id).subscribe({
        next: (res) => {
          this.coachData.set(res.data);
        },
        error: (err) => console.error('教練資料抓取失敗', err)
      });

      // B. 直接用網址抓到的 id 去抓評論，不要等 coachData 回來
      // 這樣就算教練資料慢一點，評論也能並行抓取，且 ID 絕對不會是 0
      this.reviewS.getThreeReviews(id).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.reviews.set(res.data);
          }
        },
        error: (err) => console.error('評論抓取失敗', err)
      });

      // C. 推薦名單也直接用 id
      this.recommandS.getRecommendCoaches(id).subscribe(res => {
        if (res.isSuccess) {
          this.recommendList = res.data;
        }
      });
    }

  }
  fetchAllReviews(coachId: number) {
    this.reviewS.getReviews(coachId).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.allReviews.set(res.data);
        }
      }
    });
  }


}
