import { Router } from '@angular/router';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CoachAllInfoI } from '../../../Interfaces/IIcoachAllinfo';
import { CoachS } from '../../../Service/coach-s';
import { AvatarPipe } from '../../../../shared/pipes/avatar-pipe';

@Component({
  selector: 'app-coach-recommand',
  imports: [AvatarPipe],
  templateUrl: './coach-recommand.html',
  styleUrl: './coach-recommand.css',
})
export class CoachRecommand implements OnInit, OnDestroy {
  @Input() coaches: CoachAllInfoI[] = [];
  currentIndex = 0;
  isVisible = true; // 是否顯示視窗
  intervalId: any;
  //----------------------//
  get currentCoach() {
    return this.coaches[this.currentIndex];
  }
  constructor(private router: Router) { }
  ngOnInit(): void {
    this.startAutoNext();
  }
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  //---------------------//
  startAutoNext() {
    this.intervalId = setInterval(() => {
      this.nextCoach();
    }, 3500);
  }
  nextCoach() {
    // 簡單的切換邏輯：如果是 0 就變 1，如果是 1 就變 0
    this.currentIndex = (this.currentIndex + 1) % this.coaches.length;
  }

  close() {
    this.isVisible = false;
  }
  coachIntro(id: number) {
    window.location.href = `/experience/coachinfo/${id}`;
  }
}
