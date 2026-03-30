import { Component, Input } from '@angular/core';
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Footer } from "../../../shared/footer/footer";
import { Toptab } from "../../myComponents/btn/toptab/toptab";
import { CoachPf } from "../../myComponents/card/coach-pf/coach-pf";
import { CommonModule } from '@angular/common';
import { MyCoachInfoS } from '../../Service/my-coach-info';
import { APIResponse, CoachAllInfoI } from '../../Interfaces/coachallinfo';
import { ActivatedRoute, Router } from '@angular/router';
import { Noavatar } from "../../myComponents/container/noavatar/noavatar";

//========!!這是 父Component!!================//
//========!!檢視自己的資訊!!================//


@Component({
  selector: 'app-coach-profile',
  imports: [CommonModule, CoachPf, LittleIsland, Footer, Toptab, Noavatar],
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

  //------------------------------------------------------//
  ngOnInit(): void {
    // 1. 優先從網址拿 ID
    let idFromRoute = this.route.snapshot.paramMap.get('id');

    // 2. 🔴 新增：如果網址沒 ID，試著從 localStorage 拿（這是從 Token 解出來存進去的）
    if (!idFromRoute) {
      idFromRoute = localStorage.getItem('coachId');
      console.log('網址沒 ID，從 localStorage 抓取結果:', idFromRoute);
    }

    console.log('🔴 最終認定的 ID 為:', idFromRoute);

    if (idFromRoute && idFromRoute !== '0') {
      const targetId = Number(idFromRoute);
      this.isLoading = true;

      this.mycoachInhoS.getMyInfo(targetId).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.coachData = res.data;
            console.log('🟢 API 回傳資料:', res.data);
          }
        },
        error: (err) => {
          console.error('抓取失敗', err);
          this.isLoading = false;
        },
        complete: () => this.isLoading = false
      });
    } else {
      // 如果連 localStorage 都沒有，代表真的沒登入或不是教練
      console.warn('找不到有效的 CoachId');
      this.isLoading = false;
      // this.router.navigate(['/login']); // 選用：踢回登入頁
    }
  }
}
