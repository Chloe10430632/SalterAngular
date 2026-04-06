import { AuthStore } from './../../../Service/auth-store';
import { CourseSessionInfoI } from './../../../Interfaces/IICourse';
import { Component, ElementRef, Input, OnDestroy, OnInit, Pipe, ViewChild } from '@angular/core';
import { NotificationService } from '../../../../shared/notifyService/notification-service';
import { CourseInformationS } from '../../../Service/course-information';
import { firstValueFrom, Subscription } from 'rxjs';
import { CommonModule, DecimalPipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { TransactionServiceS as TransactionServiceS } from '../../../Service/transaction.service';
import Swal from 'sweetalert2';


//================!! 子 元件!!==============================//
//================課程折疊==================================//

@Component({
  selector: 'app-course-expend-detail',
  imports: [NgClass, CommonModule, DecimalPipe],
  templateUrl: './course-expend-detail.html',
  styleUrl: './course-expend-detail.css',
  standalone: true
})
export class CourseExpendDetail implements OnInit, OnDestroy {
  data?: CourseSessionInfoI | null = null;
  private sub = new Subscription();
  isLoading: boolean = false;
  private timer: any;
  //--------------------------------------------//
  constructor(private notifyS: NotificationService,
    private couresS: CourseInformationS,
    private transS: TransactionServiceS,
    public authS: AuthStore,
    private router: Router
  ) { }
  //--------------------------------------------//
  ngOnInit() {
    this.sub.unsubscribe();
    this.stopCarousel();
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  //--------------------------------------------//
  @ViewChild('carousel') carouselRef!: ElementRef;
  @Input() set coachId(id: number | undefined) {
    if (id && id > 0) {
      this.loadLatestCourse(id); // 當 id 變動時，才去抓資料
      console.log("子接到:", id);
    }
  }

  get isCoachSelf(): boolean {
    const coachId = localStorage.getItem('coachId');
    if (!coachId || !this.data) return false;
    return Number(coachId) == this.data.coachId;
  }
  get canBook(): boolean {
    if (!this.data) return false;
    const isFull = this.data.currentParticipants >= this.data.maxParticipants;
    return !this.isCoachSelf && !isFull && !this.checkIsPast(this.data.startDate);
  }


  //--------------------------------------------//
  checkIsPast(date: string): boolean {
    return new Date(date) < new Date();
  }
  loadLatestCourse(coachId: number) {
    this.couresS.getLatestCourseByCoach(coachId).subscribe(res => {
      if (res.isSuccess) {
        this.data = res.data;
        console.log("課程:  ", res);
        this.stopCarousel();
        setTimeout(() => this.startCarousel(), 100);
      }
    });
  }
  startCarousel() {
    const images = this.data?.imageUrls ?? [];
    if (images.length <= 1) return;
    this.timer = setInterval(() => {
      const el = this.carouselRef?.nativeElement;
      if (!el) return;
      const itemWidth = el.offsetWidth;
      const maxScroll = el.scrollWidth - itemWidth;
      const next = el.scrollLeft + itemWidth;
      el.scrollTo({ left: next >= maxScroll - 1 ? 0 : next, behavior: 'smooth' });
    }, 2000);
  }

  stopCarousel() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  moreCourses(id: number) {
    this.router.navigate([`/experience/coachcoursemore/${id}`])
  }
}



