//#region import
import { Component, Injectable, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Footer } from '../../../shared/footer/footer';
import { CommonModule, NgClass } from '@angular/common';
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Rank } from '../../Service/rank';

//#endregion


//============!!父Component!!================//


@Component({
  selector: 'app-index',
  imports: [LittleIsland, CommonModule, FormsModule,  LittleIsland, Footer],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index implements OnInit {


 //=======================================//
  constructor(private rank: Rank) { }
  //=======================================//
  ngOnInit(): void {
    loadCoach();
  }
  //=======================================//

loadCoach() {
  throw new Error('Function not implemented.');
}
}


//#endregion




//#region
//#endregion


