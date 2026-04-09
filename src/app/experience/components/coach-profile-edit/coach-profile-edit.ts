import { Component } from '@angular/core';
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Footer } from "../../../shared/footer/footer";
import { Myedit } from "../../myComponents/card/myedit/myedit";
import { ActivatedRoute } from '@angular/router';

//========!!這是 父Component!!================//
//========!!編輯自己的資訊!!================//

@Component({
  selector: 'app-coach-profile-edit',
  imports: [LittleIsland, Footer, Myedit],
  templateUrl: './coach-profile-edit.html',
  styleUrl: './coach-profile-edit.css',
})
export class CoachPFEdit {
  coachId: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.coachId = this.route.snapshot.params['id'] ?? '';
    console.log('CoachPFEdit 拿到的 id:', this.coachId);
  }
}
