import { HouseService } from './../../service/index-service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-booking-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './booking-list.html',
  styleUrl: './booking-list.css',
})
export class BookingList implements OnInit {

  cancelLoadingId: number | null = null; // 紀錄正在取消哪一筆
  bookings: any[] = [];
  isLoading: boolean = false;
  constructor(private houseService: HouseService) { }

  ngOnInit(): void {
    this.fetchBookings();

  }
  // 抓取會員的預約訂單
  fetchBookings(): void {
    this.isLoading = true;
    this.houseService.getMemberBookings().subscribe({
      next: (data: any) => {
        this.bookings = data;
        this.isLoading = false;
        console.log('訂單資料:', data);
      },
      error: (err: any) => {
        console.log('抓取訂單失敗:', err);
        this.isLoading = false;
      }
    });
  }

  // 狀態文字轉換工具
  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      '0': '待付款',
      '1': '已付款',
      '2': '已完成',
      '4': '已取消'
    };
    return statusMap[status] || '未知狀態';
  }

  // 狀態標籤顏色工具
  getStatusClass(status: string): string {
    switch (status) {
      case '0': return 'badge-warning'; // 黃色
      case '1': return 'badge-success'; // 綠色
      case '2': return 'badge-info';    // 藍色
      case '4': return 'badge-error';   // 紅色
      default: return 'badge-ghost';
    }
  }

  // 取消預約
  onCancelBooking(bookingId: number): void {
    if (confirm('確定要取消這筆預約嗎？')) {
      this.houseService.cancelBooking(bookingId).subscribe({
        next: () => {
          alert('訂單已取消');
          this.cancelLoadingId = null;
          this.fetchBookings();
        },
        error: (err: any) => {
          alert('取消失敗：' + err.error.message);
          this.cancelLoadingId = null;
        }
      });
    }
  }
}

