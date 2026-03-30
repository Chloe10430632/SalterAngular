import { Component } from '@angular/core';
import { Toptab } from "../../myComponents/btn/toptab/toptab";
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Footer } from "../../../shared/footer/footer";
import { Noavatar } from "../../myComponents/container/noavatar/noavatar";
import { Myedit } from "../../myComponents/card/myedit/myedit";

@Component({
  selector: 'app-coach-pfedit',
  imports: [Toptab, LittleIsland, Footer, Noavatar, Myedit],
  templateUrl: './coach-pfedit.html',
  styleUrl: './coach-pfedit.css',
})
export class CoachPFEdit {

}
