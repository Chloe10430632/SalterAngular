import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseInfoI } from '../../../Interfaces/course.model';
import { CourseS } from '../../../Service/course-for-one';

//========!!這是 子Component!!================//

@Component({
  selector: 'app-coursefor-coach',
  imports: [CommonModule],
  templateUrl: './coursefor-coach.html',
  styleUrl: './coursefor-coach.css',
})
export class CourseforCoach implements OnInit, OnDestroy {
  course = signal<CourseInfoI | null>(null);
  /**輪播 */
  activeSlide = signal(0);
  timer: any;
  /**計算是否額滿 */
  isFull = computed(() => {
    const c = this.course();
    if (!c) return false;
    else return (c.currentStudents || 0) >= (c.maxStudents || 0)
  })
  //------------------------------------------------------//
  constructor(private courseOneS: CourseS) { }

  //------------------------------------------------------//
  ngOnInit(): void {
    this.courseOneS.getLatestCourseByCoach(1).subscribe({
      next: (result) => {
        if (result.isSuccess) {
          this.course.set(result.data); //set更新signal
          this.startCarousel();
        }
      },
      error: (err) => {
        console.error('抓資料失敗了：', err);
      }
    });
  }
  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer); // 離開頁面時停止計時器，避免耗能
  }
  //--方法-------------------------------------------------//
  startCarousel() {
    this.timer = setInterval(() => {
      const c = this.course();
      if (c && c.photoUrls && c.photoUrls.length > 0) {
        this.activeSlide.update(
          val => (val + 1) % c.photoUrls!.length  //自動循環-取餘數:確保了你的輪播到最後一張時，會乖乖地回到第一張
        )
      }
    }, 1500);
  }

}
