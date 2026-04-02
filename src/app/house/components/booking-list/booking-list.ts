import { HouseService } from './../../service/index-service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../../shared/notifyService/notification-service';

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
  constructor(private houseService: HouseService, private notification: NotificationService) { }

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


  loadBookings() {
    this.isLoading = true;
    // 這裡替換成你實際抓取使用者訂單的 API
    this.houseService.getMemberBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('載入訂單失敗', err);
        this.isLoading = false;
      }
    });
  }

  // 取消預約
  onCancelBooking(bookingId: number): void {
    if (confirm('確定要取消這筆預約嗎？')) {
      this.houseService.cancelBooking(bookingId).subscribe({
        next: () => {
          this.notification.show('訂單已取消', 'success');
          this.cancelLoadingId = null;
          this.fetchBookings();
        },
        error: (err: any) => {
          this.notification.show('取消失敗：' + err.error.message, 'error');
          this.cancelLoadingId = null;
        }
      });
    }
  }

  // 金流
  onPay(bookingId: number) {
    this.houseService.payBooking(bookingId).subscribe({
      next: (htmlForm: string) => {
        // 建立一個隱藏的 div 容器
        const payDiv = document.createElement('div');
        payDiv.id = 'ecpay-payment-container';
        payDiv.style.display = 'none'; // 不要讓使用者看到表單內容
        payDiv.innerHTML = htmlForm;

        // 加入到 body 中
        document.body.appendChild(payDiv);

        // 找出表單並提交
        const form = payDiv.querySelector('form') as HTMLFormElement;
        if (form) {
          form.submit();
        }
      },
      error: (err) => {
        console.error('金流發送失敗：', err);
        // 這裡可以跳一個 SweetAlert 或通知
      }
    });
  }
}

