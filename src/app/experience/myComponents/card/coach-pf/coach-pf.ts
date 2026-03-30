import { Component, Input, OnInit } from '@angular/core';
import { MyCoachInfoS } from '../../../Service/my-coach-info';
import { CoachAllInfoI } from '../../../Interfaces/coachallinfo';
import { CommonModule } from '@angular/common';

//========!!這是 子Component!!================//
//========!!放在檢視資訊!!================//

@Component({
  selector: 'app-coach-pf',
  imports: [CommonModule],
  templateUrl: './coach-pf.html',
  styleUrl: './coach-pf.css',
})
export class CoachPf {
  coachData?: CoachAllInfoI; // 準備一個位子放教練資料
  isLoading = true;

  //------------------------------------------------------//
  constructor(private mycoachInhoS: MyCoachInfoS) { }
  @Input() data?: CoachAllInfoI;
  //------------------------------------------------------//

}



