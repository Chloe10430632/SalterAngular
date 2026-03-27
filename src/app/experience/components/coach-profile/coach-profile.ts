import { Component } from '@angular/core';
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Footer } from "../../../shared/footer/footer";
import { Toptab } from "../../myComponents/btn/toptab/toptab";
import { CoachPf } from "../../myComponents/card/coach-pf/coach-pf";



@Component({
  selector: 'app-coach-profile',
  imports: [LittleIsland, Footer, Toptab, CoachPf],
  templateUrl: './coach-profile.html',
  styleUrl: './coach-profile.css',
})
export class CoachProfile {


}
