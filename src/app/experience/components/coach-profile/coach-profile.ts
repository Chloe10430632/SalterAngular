import { Component, Input } from '@angular/core';
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Footer } from "../../../shared/footer/footer";
import { Toptab } from "../../myComponents/btn/toptab/toptab";
import { CoachPf } from "../../myComponents/card/coach-pf/coach-pf";
import { CommonModule } from '@angular/common';
import { MyCoachInfoS } from '../../Service/my-coach-info';
import { APIResponse, CoachAllInfoI } from '../../Interfaces/coachallinfo';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-coach-profile',
  imports: [CommonModule, CoachPf, LittleIsland, Footer, Toptab],
  templateUrl: './coach-profile.html',
  styleUrl: './coach-profile.css',
})
export class CoachProfile {
  coachData?: CoachAllInfoI;
  isLoading = true;
  //------------------------------------------------------//
  constructor(private mycoachInhoS: MyCoachInfoS,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  @Input() data?: CoachAllInfoI;
  //------------------------------------------------------//
  ngOnInit(): void {
    // 1. 取得網址上的 ID
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // 2. 只有在 ID 存在時才去抓資料 (避免發送無意義的請求)
    if (id) {
      this.isLoading = true; // 開始載入

      this.mycoachInhoS.getMyInfo(id).subscribe({
        // 成功拿回來的處理邏輯
        next: (res) => {
          if (res.isSuccess) {
            this.coachData = res.data; // 菜煮好放到托盤上
          }
        },
        // 發生錯誤（例如網路斷了、伺服器爆炸）的處理
        error: (err) => {
          console.error('抓取失敗：', err);
          // 你也可以在這裡加一個 alert("系統忙碌中")
        },
        // 不管成功或失敗，最後都會執行的動作
        complete: () => {
          this.isLoading = false; // 關閉載入動畫
        }
      });
    } else {
      this.isLoading = false;
      console.warn('網址裡沒有教練 ID 喔！');
    }
  }
}
