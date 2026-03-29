import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, output, Output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarPipe } from '../../../../shared/pipes/avatar-pipe';
import { CoachAllInfoI } from '../../../Interfaces/coachallinfo';
import { CoachAllInfoS } from '../../../Service/coach-all-info-s';
import { UiS } from '../../../Service/UiS';
import { FavI } from '../../../Interfaces/myfav';
import { CourseForOneS } from '../../../Service/course-for-one';
import { SessionDisplayS } from '../../../Service/session-display';

//========!!這是 子Component!!================//
//========!!放在首頁和收藏!!================//

@Component({
  selector: 'app-fav-card',
  imports: [CommonModule, AvatarPipe],
  templateUrl: './fav-card.html',
  styleUrl: './fav-card.css',
})
export class FavCard implements OnInit {
  // --- 核心改動：改用 input signal 接收整個物件 ---
  // 這樣首頁傳進來的 item 就會直接變成我們需要的資料
  coachItem = input.required<CoachAllInfoI>({ alias: 'item' });
  isFav = false;
  myFavId: number[] = [];
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
  @Output() removeMe = new EventEmitter<number>(); //通知父組件（例如收藏頁面要移除這張卡片）
  //------------------------------------------------------//
  ngOnInit(): void {
    /**最新課程 */
    this.findLatestCourse();
    /**收藏inDB */
    this.loadHeart(); // 頁面一打開就去抓收藏清單，看看這個教練有沒有在裡面
  }
  //----------------方法-----------------------------------//
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
    const id = this.coachItem().coachId;
    const favData: FavI = { coachId: id, isSuccess: false, message: '' };

    this.coachInfoS.changeFav(favData).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          if (!this.myFavId.includes(id)) {
            this.myFavId = [...this.myFavId, id];
            this.uiS.showToast("收藏教練一人！");
          } else {
            this.myFavId = this.myFavId.filter(fid => fid !== id);
            this.removeMe.emit(id); // 通知父組件
            this.uiS.showToast("教練出走了QAQ");
          }
        }
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
  intro() {
    // 這裡直接從 input 拿 ID，不用外面傳進來
    const id = this.coachItem().coachId;
    this.router.navigate([`/experience/coachintro/${id}`]);
  }

}
