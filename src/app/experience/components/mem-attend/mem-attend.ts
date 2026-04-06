import { Component, OnInit } from '@angular/core';
import { AttendCourseCard } from "../../myComponents/card/attend-course-card/attend-course-card";
import { Footer } from "../../../shared/footer/footer";
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Noavatar } from "../../myComponents/container/noavatar/noavatar";
import { CommonModule } from '@angular/common';
import { CourseOrderI } from '../../Interfaces/IIOrder';
import { HistoryS } from '../../Service/history';

@Component({
  selector: 'app-mem-attend',
  imports: [CommonModule, AttendCourseCard, Noavatar, LittleIsland, Footer],
  templateUrl: './mem-attend.html',
  styleUrl: './mem-attend.css',
})
export class MemAttend implements OnInit {
  orders: CourseOrderI[] = [];

  constructor(private historyS: HistoryS) { }

  ngOnInit(): void {
    this.historyS.getAttendHistory().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.orders = res.data.sort((a, b) => (b.expTransactionId ?? 0) - (a.expTransactionId ?? 0));
        }
      },
      error: (err) => console.error('拿歷程失敗', err)
    });
  }
}
