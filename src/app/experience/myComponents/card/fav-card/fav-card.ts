import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarPipe } from '../../../../shared/pipes/avatar-pipe';
import { CoachAllInfoI } from '../../../Interfaces/coachallinfo';
import { CoachAllInfoS } from '../../../Service/coach-all-info-s';
import { UiS } from '../../../Service/UiS';
import { FavI } from '../../../Interfaces/myfav';
import { CourseForOneS } from '../../../Service/course-for-one';
import { SessionDisplayS } from '../../../Service/session-display';
import { get } from 'sortablejs';

//========!!這是 子Component!!================//
//========!!放在首頁和收藏!!================//

@Component({
  selector: 'app-fav-card',
  imports: [CommonModule, AvatarPipe],
  templateUrl: './fav-card.html',
  styleUrl: './fav-card.css',
})
export class FavCard implements OnInit {
  coach = signal<CoachAllInfoI | null>(null);
  coaches: any[] = [];
  isFav = false;
  myFavId: number[] = [];
  reviewDatas: any[] = [];
  latestCourseName: string = '載入中...';
  //------------------------------------------------------//
  constructor(
    private router: Router,
    private coachInfoS: CoachAllInfoS,
    private courseNameS: CourseForOneS,
    private sessionTimeS: SessionDisplayS,
    private uiS: UiS // 注入 UI 服務
  ) { }
  @Input() coachId: number = 1000010; // 讓外部決定要抓哪一個 ID，預設值先給1000010
  @Input() item: any;
  @Output() removeMe = new EventEmitter<number>(); // 送出 CoachId
  //------------------------------------------------------//
  ngOnInit(): void {
    /**最新課程 */
    this.findLatestCourse();

    /**收藏inDB */
    this.loadHeart(); // 頁面一打開就去抓收藏清單，看看這個教練有沒有在裡面
  }
  //--方法-------------------------------------------------//
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
            this.uiS.showToast("收藏教練一人！");
            console.log(this.myFavId);
          }
          // 檢查：如果原本陣列裡「有」這個 ID，代表剛才是執行「取消」
          else {
            this.myFavId = this.myFavId.filter(id => id !== coachId); // 踢掉，愛心變灰

            this.removeMe.emit(this.item.coachId); // 送出事件告訴父元件，這個 ID 被取消收藏了
            this.uiS.showToast("教練出走了QAQ"); // 顯示取消收藏的提示訊息
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


  /**查詢評論 */
  onReviewClick(coachId: number) {
    this.coachInfoS.goToReview(coachId).subscribe({
      next: (result) => {
        this.reviewDatas = [result.data];
      },
      error: (err) => {
        console.error("無法獲取評論資料", err);
      }
    });
  }
  /**最新課程 */
  findLatestCourse() {
    // 1. 先拿所有場次
    this.sessionTimeS.getAllTimeSession().subscribe(sessionRes => {
      const sessions = sessionRes.data; // 這才是真正的 Array

      if (sessions && sessions.length > 0) {
        // 2. 排序找出最新的場次
        const latestSession = [...sessions].sort((a, b) => {
          return new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime();
        })[0];

        // 3. 拿到最新場次後，再去拿所有課程名稱來比對
        this.courseNameS.getAllNameCourses().subscribe(courseRes => {
          const allCourses = courseRes.data;
          const matchedCourse = allCourses.find(c => c.coachId === latestSession.coachId);

          // 4. 成功存入變數，HTML 就會自動更新！
          this.latestCourseName = matchedCourse?.title || '新課程準備中...';
        });
      }
    });
  }

  //========================================//
  intro(coachId: number) {
    this.router.navigate([`/experience/coachintro/${coachId}`])
  }

}
