import { Component } from '@angular/core';
import { Toptab } from "../../myComponents/btn/toptab/toptab";
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Footer } from "../../../shared/footer/footer";
import { Noavatar } from "../../myComponents/container/noavatar/noavatar";
import { Myedit } from "../../myComponents/card/myedit/myedit";

//========!!這是 父Component!!================//
//========!!編輯自己的資訊!!================//

@Component({
  selector: 'app-coach-profile-edit',
  imports: [LittleIsland, Footer, Myedit],
  templateUrl: './coach-profile-edit.html',
  styleUrl: './coach-profile-edit.css',
})
export class CoachPFEdit {

}
