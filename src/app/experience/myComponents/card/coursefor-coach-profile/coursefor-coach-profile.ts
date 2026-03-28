import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { CoachAllInfoS } from '../../../Service/coach-all-info-s';
import { CoachAllInfoI as CoachAllInfoM } from '../../../Interfaces/coachallinfo';
import { ActivatedRoute } from '@angular/router';
import { FavI } from '../../../Interfaces/myfav';
import { AvatarPipe } from '../../../../shared/pipes/avatar-pipe';


//========!!這是 子Component!!================//

@Component({
  selector: 'app-coursefor-coach-profile',
  imports: [CommonModule, AvatarPipe],
  templateUrl: './coursefor-coach-profile.html',
  styleUrl: './coursefor-coach-profile.css',
})
export class CourseforCoachProfile implements OnInit {
  coach = signal<CoachAllInfoM | null>(null);
  isFav = false;

  //------------------------------------------------------//
  constructor(private coachInfoS: CoachAllInfoS,
    private route: ActivatedRoute // 注入網址工具
  ) { }
  @Input() coachId: number = 1000010; // 讓外部決定要抓哪一個 ID，預設值先給1000010
  //------------------------------------------------------//
  ngOnInit(): void {

    //從網址抓參數 (params['id'] 要對應你的路由設定)
    this.route.params.subscribe(params => {
      const id = +params['id']; // 加個 "+" 號可以把字串轉成數字
      if (id) {
        this.loadCoach(id);
      } else {
        // 2. 如果網址沒參數，用 Input 的 ID
        this.loadCoach(this.coachId);
      }
    });
  }
  //--方法-------------------------------------------------//
  /**是哪個教練的介紹 */
  loadCoach(coachId: number) {
    this.coachInfoS.getCoachInfo(coachId).subscribe(
      result => {
        this.coach.set(result.data);
      });// result 是包裹 (APIResponse)
    // result.data 才是教練本人 (CoachAllInfoI)
  }
  /**收藏 */
  toggleFav() {
    const currentId = this.coach()?.coachId;
    if (!currentId) return;
    // 將數字包裝成物件送出
    const favData: FavI = {
      coachId: currentId,
      isSuccess: false,
      message: ''
    };

    // 把數字包進物件裡，對應 I 的名稱 { coachId: currentId }
    this.coachInfoS.changeFav(favData).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.isFav = !this.isFav;
          console.log(res.message);
        }
      }
    })
  }
  /** */

}
