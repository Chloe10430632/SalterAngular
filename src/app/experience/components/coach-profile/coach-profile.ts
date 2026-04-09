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
  coachId: string = '';
  //------------------------------------------------------//
  constructor(
    private coachS: CoachS,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  //------------------------------------------------------//
  ngOnInit(): void {
    // const coachId = this.currentCoachId;
    // if (coachId) {
    //   this.router.navigate([`/experience/coachprofile/${coachId}`]);
    // } else {
    //   this.router.navigate(['/experience/coachpfe']);
    // }
    this.coachId = this.route.snapshot.params['id'] ?? '';
    console.log('CoachPFEdit 拿到的 id:', this.coachId);

    // 1. 優先從網址拿 ID
    let idFromRoute = this.route.snapshot.paramMap.get('id');


    // 2. 🔴 新增：如果網址沒 ID，試著從 localStorage 拿（這是從 Token 解出來存進去的）
    if (!idFromRoute) {
      idFromRoute = localStorage.getItem('coachId');
    }

   console.log('最終認定的 ID 為:', idFromRoute);

  if (idFromRoute && idFromRoute !== '0') {
    this.isLoading = true;
    this.coachS.getCoachInfoNum(Number(idFromRoute)).subscribe({
      next: (res) => {
        if (res && res.isSuccess) {
          this.coachData = res;
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  } else {
    console.warn('找不到有效的 CoachId');
    this.isLoading = false;
  }
}
}
