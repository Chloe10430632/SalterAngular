import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { CoachCardInfoS } from '../../../Service/coach-card-info-s';
import { CoachAllInfoI as CoachAllInfoI } from '../../../Interfaces/IIcoachAllinfo';
import { ActivatedRoute } from '@angular/router';
import { FavI } from '../../../Interfaces/IImyfav';
import { AvatarPipe } from '../../../../shared/pipes/avatar-pipe';
import { CoachS } from '../../../Service/coach-s';


//========!!這是 子Component!!================//
//========!!放在教練介紹頁!!==================//
//========!!一頁大卡!!=======================//


@Component({
  selector: 'app-coursefor-coach-profile',
  imports: [CommonModule, AvatarPipe],
  templateUrl: './coursefor-coach-profile.html',
  styleUrl: './coursefor-coach-profile.css',
})
export class CourseforCoachProfile implements OnInit {
  coach = signal<CoachAllInfoI | null>(null);
  coaches: any[] = [];
  isFav = false;
  myFavId: number[] = [];
  //------------------------------------------------------//
  constructor(
    private coachS: CoachS,
    private coachInfoS: CoachCardInfoS,
    private route: ActivatedRoute, // 注入網址工具
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
    this.loadHeart(); // 頁面一打開就去抓收藏清單，看看這個教練有沒有在裡面
  }
  //--方法-------------------------------------------------//
  /**是哪個教練的介紹 */
  loadCoach(coachId: number) {
    this.coachS.getMyInfoNum(coachId).subscribe({
      next: (result: any) => {
        if (result && result.data) {
          this.coach.set(result.data); // 這裡存入的是 CoachAllInfoI 本人
          console.log('🟢 成功設定教練資料:', this.coach());
        }
      },
      error: (err) => {
        console.error('抓取教練資料失敗', err);
      }
    });// result 是包裹 (APIResponse)
    // result.data 才是教練本人 (CoachAllInfoI)
  }
  /**愛心亮不亮 */
  loadHeart() {
    this.coachInfoS.HeartIds().subscribe({
      next: (ids: any) => {
        console.log('正式檢查：', ids);

        if (ids && Array.isArray(ids.data)) {
          this.myFavId = ids.data;
        }
        else {
          this.myFavId = [];
          console.warn("後端回傳格式不正確，預期是 { data: number[] }，但收到：", ids);
        }
        console.log('目前的收藏 ID 陣列：', this.myFavId);
      },
      error: (err) => {
        console.error('抓取失敗', err);
        this.myFavId = [];
      }
    });
  }
  /**收藏 */
  toggleFav(coachId: number) {
    const favData: FavI = {
      coachId: coachId,
      isSuccess: false,
      message: ''
    };

    // 直接呼叫同一隻 API
    this.coachInfoS.changeFav(favData).subscribe({
      next: (res) => {
        // 假設後端執行成功（不論是新增還是刪除成功）
        if (res.isSuccess) {

          // 檢查：如果原本陣列裡「沒有」這個 ID，代表剛才是執行「新增」
          if (!this.myFavId.includes(coachId)) {
            this.myFavId = [...this.myFavId, coachId]; // 加進去，愛心變紅
            console.log(this.myFavId);
          }
          // 檢查：如果原本陣列裡「有」這個 ID，代表剛才是執行「取消」
          else {
            this.myFavId = this.myFavId.filter(id => id !== coachId); // 踢掉，愛心變灰
          }

        } else {
          console.error("後端處理失敗:", res.message);
        }
      },
      error: (err) => {
        console.error("網路或伺服器錯誤", err);
      }
    });
  }

}


