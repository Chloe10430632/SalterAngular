import { Component, Input } from '@angular/core';
import { CoachAllInfoI } from '../../../Interfaces/IIcoachAllinfo';
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


  //------------------------------------------------------//
  @Input() data?: CoachAllInfoI;
  //------------------------------------------------------//

}



