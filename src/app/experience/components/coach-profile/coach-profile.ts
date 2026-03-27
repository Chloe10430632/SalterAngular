import { Component } from '@angular/core';
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Footer } from "../../../shared/footer/footer";
import { DatePipe } from '@angular/common';
import { Toptab } from "../../myComponents/btn/toptab/toptab";


@Component({
  selector: 'app-coach-profile',
  imports: [DatePipe, LittleIsland, Footer, Toptab],
  templateUrl: './coach-profile.html',
  styleUrl: './coach-profile.css',
})
export class CoachProfile {
  coachName = 'Daisy 大師';
  coachTags = ['健身教練', '營養諮詢'];
  bioDescription = '擁有超過 10 年的專業教學經驗，專精於前端開發與 UI/UX 設計。致力於協助學生從零開始建構高品質的 Web 應用程式。我深信每位學員都有無限的潛力，只需透過系統化的引導，持之以恆的練習，就能達成心中的理想目標。';
  lastUpdated = new Date('2026-03-20T17:43:00');

}
