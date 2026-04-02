import { Component, computed, input, Input, OnInit, signal } from '@angular/core';
import { AvatarPipe } from '../../../../shared/pipes/avatar-pipe';
import { Toptab } from "../../btn/toptab/toptab";

import { CoachAllInfoI } from '../../../Interfaces/IIcoachAllinfo';
import { CoachS } from '../../../Service/coach-s';


@Component({
  selector: 'app-withavatar',
  imports: [AvatarPipe, Toptab],
  templateUrl: './withavatar.html',
  styleUrl: './withavatar.css',
})
export class Withavatar implements OnInit {
  coachData = signal<CoachAllInfoI | null>(null);
  //--------------------//

  constructor(private coachS: CoachS) { }
  //--------------------//
  @Input() title = "Title";
  //--------------------//
  ngOnInit(): void {
    const savedId = localStorage.getItem('coachId');

    if (savedId) {
      // 3. 如果有 ID，就請 Service 去抓資料
      this.coachS.getMyInfoStr(savedId).subscribe({
        next: (data) => {
          this.coachData.set(data.data); // 抓成功了，塞進 Signal
          console.log('成功抓到教練資料：', data);
        },
        error: (err) => {
          console.error('抓取失敗，可能 ID 不對或網路問題', err);
        }
      });
    } else {
      console.warn('抽屜裡沒有 coachId，請先登入喔！');
    }
  }
}
//--------------------//

