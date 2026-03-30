import { Component, Input } from '@angular/core';
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Footer } from "../../../shared/footer/footer";
import { Toptab } from "../../myComponents/btn/toptab/toptab";
import { CoachPf } from "../../myComponents/card/coach-pf/coach-pf";
import { CommonModule } from '@angular/common';
import { MyCoachInfoS } from '../../Service/my-coach-info';
import { APIResponse, CoachAllInfoI } from '../../Interfaces/coachallinfo';
import { ActivatedRoute, Router } from '@angular/router';

//========!!這是 父Component!!================//
//========!!檢視自己的資訊!!================//


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

  //------------------------------------------------------//
  ngOnInit(): void {
    // 1. 只從網址拿 ID
    const idFromRoute = this.route.snapshot.paramMap.get('id');

    // 2. 印出來檢查，看看程式「此時此刻」認定的 ID 是多少
    console.log('🔴 偵測到網址 ID 為:', idFromRoute);

    if (idFromRoute) {
      const targetId = Number(idFromRoute);

      // 3. 確保這裡傳給 Service 的是真的 targetId
      this.mycoachInhoS.getMyInfo(targetId).subscribe({
        next: (res) => {
          this.coachData = res.data;
          // 這裡也印一下，看看後端回傳的資料裡面，id 是不是 1001024
          console.log('🟢 API 回傳資料:', res.data);
        }
      });
    }
    //----------------------------------------//
  }
}
