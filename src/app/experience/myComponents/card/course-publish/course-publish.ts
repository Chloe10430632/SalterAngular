import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CourseSessionInfoI } from '../../../Interfaces/IICourse';
import { NotificationService } from '../../../../shared/notifyService/notification-service';
import Swal from 'sweetalert2';

//===============!!這是 子 元件!!==================//
//===============!!上架中!!==================//

@Component({
  selector: 'app-course-publish',
  imports: [CommonModule],
  templateUrl: './course-publish.html',
  styleUrl: './course-publish.css',
})
export class CoursePublish {
  @Input() data!: CourseSessionInfoI; // 建議換成你的 Interface
  @Output() remove = new EventEmitter<number>();
  //-------------------------------------------//
  constructor(private notifyS: NotificationService) { }
  //-------------------------------------------//
  checkIsPast(startDate: string): boolean {
    if (!startDate || startDate.length === 0) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const courseDate = new Date(startDate);
    courseDate.setHours(0, 0, 0, 0);
    return courseDate < today;
  }

  onDelete(id: number) {
    if (!id) return;
    if (this.data.currentStudents && this.data.currentStudents > 0) {
      Swal.fire({
        title: '無法下架',
        text: `目前已有 ${this.data.currentStudents} 位學生報名，不可以任性`,
        icon: 'error',
        confirmButtonColor: '#8B4513'
      });
      return;
    }
    this.remove.emit(id);
  }

}
