import { NotificationService } from './../../../../shared/notifyService/notification-service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarPipe } from '../../../../shared/pipes/avatar-pipe';
import { CoachAllInfoI } from '../../../Interfaces/IIcoachAllinfo';
import { CoachCardInfoS } from '../../../Service/coach-card-info-s';
import { FavI } from '../../../Interfaces/IImyfav';


//========!!這是 子Component!!================//
//========!!教練卡!!================//
//========!!放在首頁和收藏!!================//

@Component({
  selector: 'app-fav-card',
  imports: [CommonModule, AvatarPipe],
  templateUrl: './fav-card.html',
  styleUrl: './fav-card.css',
  standalone: true,
})
export class FavCard implements OnInit {
  // --- 核心改動：改用 input signal 接收整個物件 ---
  isFav = input<boolean>(false);
  // 這樣首頁傳進來的 item 就會直接變成我們需要的資料
  coachItem = input.required<CoachAllInfoI>({ alias: 'item' });
  courseName = input<string>('搜尋中...', { alias: 'courseName' });

  //------------------------------------------------------//
  constructor(
    private router: Router,
    private coachInfoS: CoachCardInfoS,
    public notificationS: NotificationService
  ) { }
  //------------------------------------------------------//
  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  @Output() removeMe = new EventEmitter<number>(); //通知父組件（例如收藏頁面要移除這張卡片）
  //------------------------------------------------------//
  ngOnInit(): void {
    console.log('卡片：', this.coachItem().coachName);
  }
  //----------------方法-----------------------------------//
  /**收藏 */
  toggleFav(event: Event) {
    if (!this.isLoggedIn) {
      event.preventDefault(); // ← 阻止 checkbox 狀態被 DOM 切換
      this.notificationS.show('登入才能收藏', 'error');
      return;
    }

    const id = this.coachItem().coachId;
    const favData: FavI = { coachId: id, isSuccess: false, message: '', data: '' };

    this.coachInfoS.changeFav(favData).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          if (res.data === "請先登入後才能收藏喔！") {
            this.notificationS.show(res.data, 'error');
            return;
          }
          // 用 isFav() 的當下值判斷目前狀態
          if (this.isFav()) {
            this.removeMe.emit(id);
            this.notificationS.show('取消收藏QAQ', 'error');
           
          } else {
            // 如果本來「不是」收藏，現在要「加入」
            this.notificationS.show('收藏成功', 'success');
            // this.isFav.set(true);
          }

        } else {
          // --- 這裡很重要：如果後端回傳 false (例如請先登入)，要跳錯誤提示 ---
          this.notificationS.show('登入後才能收藏', 'error');
        }
      },
      error: (err) => {
        this.notificationS.show('連線伺服器失敗', 'error');
      }

    }
    );
  }


  /**查詢評論 */
  // onReviewClick(coachId: number) {
  //   this.coachInfoS.goToReview(coachId).subscribe({
  //     next: (result) => {
  //       this.reviewDatas = [result.data];
  //     },
  //     error: (err) => {
  //       console.error("無法獲取評論資料", err);
  //     }
  //   });
  // }
  //========================================//
  intro(id: number) {
    console.log('教練 ID:', id);
    this.router.navigate(['experience/coachinfo', id]);
  }

}


