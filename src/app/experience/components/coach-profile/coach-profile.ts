import { Component, Input } from '@angular/core';
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Footer } from "../../../shared/footer/footer";
import { Toptab } from "../../myComponents/btn/toptab/toptab";
import { CoachPf } from "../../myComponents/card/coach-pf/coach-pf";
import { CommonModule } from '@angular/common';
import { APIResponse, CoachAllInfoI } from '../../Interfaces/IIcoachAllinfo';
import { ActivatedRoute, Router } from '@angular/router';
import { Noavatar } from "../../myComponents/container/noavatar/noavatar";
import { CoachS } from '../../Service/coach-s';

//========!!這是 父Component!!================//
//========!!檢視自己的資訊!!================//


@Component({
  selector: 'app-coach-profile',
  imports: [CommonModule, CoachPf, LittleIsland, Footer, Toptab, Noavatar],
  templateUrl: './coach-profile.html',
  styleUrl: './coach-profile.css',
})
export class CoachProfile {
  coachData?: APIResponse<CoachAllInfoI>;
  //coachData? :CoachAllInfoI;
  isLoading = true;
  id?: number;
  currentCoachId: string = '';
  //------------------------------------------------------//
  constructor(
    private coachS: CoachS,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  //------------------------------------------------------//
  ngOnInit(): void {
    const coachId = this.currentCoachId;
    if (coachId) {
      this.router.navigate([`/experience/coachprofile/${coachId}`]);
    } else {
      this.router.navigate(['/experience/coachpfe']);
    }

    // 1. 優先從網址拿 ID
    let idFromRoute = this.route.snapshot.paramMap.get('id');


    // 2. 🔴 新增：如果網址沒 ID，試著從 localStorage 拿（這是從 Token 解出來存進去的）
    if (!idFromRoute) {
      idFromRoute = localStorage.getItem('coachId');
    }

    console.log('🔴 最終認定的 ID 為:', idFromRoute);

    if (idFromRoute && idFromRoute !== '0') {
      const targetId = Number(idFromRoute);
      this.isLoading = true;

      this.coachS.getCoachInfoNum(targetId).subscribe({
        next: (res) => {
          console.log('🔴 父組件收到回應：', res); // 這裡沒印代表你可能在看舊的程式碼
          if (res && res.isSuccess) {
            this.coachData = res; // 確保變數名稱是 coachData
          }
        },
        complete: () => {
          this.isLoading = false; // 🟢 關鍵：一定要設為 false，不然畫面會一直卡在轉圈圈或空白
        }
      });
    } else {
      // 如果連 localStorage 都沒有，代表真的沒登入或不是教練
      console.warn('找不到有效的 CoachId');
      this.isLoading = false;
      // this.router.navigate(['/login']); // 選用：踢回登入頁
    }
  }
}
