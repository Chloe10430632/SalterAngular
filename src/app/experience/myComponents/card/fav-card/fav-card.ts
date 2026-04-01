import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input,  OnInit,  Output } from '@angular/core';
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
  ) { }
  @Output() removeMe = new EventEmitter<number>(); //通知父組件（例如收藏頁面要移除這張卡片）
  //------------------------------------------------------//
  ngOnInit(): void {
    console.log('卡片：', this.coachItem().coachName);
  }
  //----------------方法-----------------------------------//
  /**收藏 */
  toggleFav() {
    const id = this.coachItem().coachId;
    const favData: FavI = { coachId: id, isSuccess: false, message: '' };

    this.coachInfoS.changeFav(favData).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          // 用 isFav() 的當下值判斷目前狀態
          if (!this.isFav()) {
            // 父層會在下次 HeartIds 更新時同步，或你可以 emit 事件讓父層加
          } else {
            this.removeMe.emit(id);
          }
        }
      }
    });
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


