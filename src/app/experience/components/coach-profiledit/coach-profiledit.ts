import { Component } from '@angular/core';
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Footer } from "../../../shared/footer/footer";
import { Toptab } from "../../myComponents/btn/toptab/toptab";
import { Coachedit } from "../../myComponents/card/coachedit/coachedit";

@Component({
  selector: 'app-coach-detail',
  imports: [LittleIsland, Footer, Toptab, Coachedit],
  templateUrl: './coach-profiledit.html',
  styleUrl: './coach-profiledit.css',
})
export class CoachDetail {

}
