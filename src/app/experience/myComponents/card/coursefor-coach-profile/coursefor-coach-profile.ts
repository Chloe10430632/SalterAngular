import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Input, OnInit, Output, signal } from '@angular/core';
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
  isFav = input<boolean>(false);
  myFavId: number[] = [];
  coachItem = input.required<CoachAllInfoI>({ alias: 'item' });
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
  @Output() removeMe = new EventEmitter<number>(); //通知父組件（例如收藏頁面要移除這張卡片）
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
  toggleFav(event: Event) {
    if (!this.isLoggedIn) {
      event.preventDefault();
      this.notificationS.show('登入才能收藏', 'error');
      return;
    }

    const currentCoach = this.coach();
    if (!currentCoach) return;

    const id = currentCoach.coachId; // ← 用 coach() 而不是 coachItem()
    const favData: FavI = { coachId: id, isSuccess: false, message: '', data: '' };

    this.coachInfoS.changeFav(favData).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          if (this.myFavId.includes(id)) {
            // 原本有收藏 → 取消
            this.myFavId = this.myFavId.filter(x => x !== id);
            this.notificationS.show('取消收藏QAQ', 'success');
          } else {
            // 原本沒收藏 → 新增
            this.myFavId = [...this.myFavId, id];
            this.notificationS.show('收藏成功', 'success');
          }
        } else {
          event.preventDefault(); // API 失敗時也阻止視覺切換
          this.notificationS.show('登入後才能收藏', 'error');
        }
      },
      error: () => {
        event.preventDefault();
        this.notificationS.show('連線伺服器失敗', 'error');
      }
    });
  }
}

