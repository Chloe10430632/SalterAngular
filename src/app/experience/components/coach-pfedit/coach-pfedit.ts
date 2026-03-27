import { Component } from '@angular/core';
import { Coachpfedit } from "../../myComponents/card/coachpfedit/coachpfedit";
import { Toptab } from "../../myComponents/btn/toptab/toptab";
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Footer } from "../../../shared/footer/footer";

@Component({
  selector: 'app-coach-pfedit',
  imports: [Coachpfedit, Toptab, LittleIsland, Footer],
  templateUrl: './coach-pfedit.html',
  styleUrl: './coach-pfedit.css',
})
export class CoachPFEdit {

}
