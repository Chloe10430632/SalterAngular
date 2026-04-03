import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { CoachCardInfoS } from '../../../Service/coach-card-info-s';
import { CoachAllInfoI as CoachAllInfoI } from '../../../Interfaces/IIcoachAllinfo';
import { ActivatedRoute, Router } from '@angular/router';
import { FavI } from '../../../Interfaces/IImyfav';
import { AvatarPipe } from '../../../../shared/pipes/avatar-pipe';
import { CoachS } from '../../../Service/coach-s';
import { NotificationService } from '../../../../shared/notifyService/notification-service';


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
    public notificationS: NotificationService,
    private router: Router
  ) { }
  //------------------------------------------------------//
  get checkIsFav(): boolean {
    const currentCoach = this.coach();
    if (!currentCoach) return false;
    return this.myFavId.includes(currentCoach.coachId);
  }

  // 判斷是否已登入
  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  //------------------------------------------------------//
  ngOnInit(): void {

    //從網址抓參數 (params['id'] 要對應你的路由設定)
    this.route.params.subscribe(params => {
      const id = +params['id']; // 加個 "+" 號可以把字串轉成數字
      if (id) {
        this.loadCoach(id);
      } else {
        // 2. 如果網址沒參數，用 Input 的 ID
        this.notificationS.show('教練資料沉入海底', "error")
        this.router.navigate(['/'])
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
      message: '',
      data: ''
    };

    this.coachInfoS.changeFav(favData).subscribe({
      next: (res: any) => {
        // 注意後端回傳大小寫，如果是 issuccess 請改為 res.issuccess
        if (res.isSuccess || res.issuccess) {
          if (res.data === "請先登入後才能收藏喔！") {
            this.notificationS.show(res.data, 'error');
            return;
          }

          // --- 修正 3：邏輯判斷與狀態同步 ---
          if (!this.checkIsFav) {
            // 原本沒收藏 -> 現在變收藏
            this.myFavId.push(coachId); // 手動加入陣列，讓畫面愛心立即變亮
            this.notificationS.show('收藏成功', 'success');
          } else {
            // 原本有收藏 -> 現在取消收藏
            this.myFavId = this.myFavId.filter(id => id !== coachId); // 從陣列移除
            this.notificationS.show('已取消收藏', 'success');
          }
        } else {
          this.notificationS.show(res.data || '收藏失敗', 'error');
        }
      },
      error: (err) => {
        this.notificationS.show('連線伺服器失敗', 'error');
      }
    });
  }
}

