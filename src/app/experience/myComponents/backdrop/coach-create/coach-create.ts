import { Component, OnInit } from '@angular/core';
import { Footer } from "../../../../shared/footer/footer";
import { SCoachPersonalInformation } from '../../../Service/Scoach-personal-information';

@Component({
  selector: 'app-coach-create',
  imports: [Footer],
  templateUrl: './coach-create.html',
  styleUrl: './coach-create.css',
})
export class CoachCreate implements OnInit {
  constructor(private scinfo: SCoachPersonalInformation) { }
  ngOnInit() {
    // if (!this.scinfo.hasProfile) {
    //   // 如果有資料，就去 API 抓取並填入表單
    //   this.scinfo.coachData(this.coachId).subscribe((data) => {
    //     this.scinfo.patchValue(data); // 將 API 資料填入 DaisyUI 表單
    //   });
    // } else {
    //   // 沒申請過，保持表單為預設空值
    //   this.scinfo.reset();
    // }
  }

  cancel() {

  }
  save() {

  }
}
