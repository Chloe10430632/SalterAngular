import { NotificationService } from './../../../shared/notifyService/notification-service';
import { AvatarPipe } from './../../../shared/pipes/avatar-pipe';
import { CurrentUser } from './../../../forum/interfaces/currentUser';
import { AuthService } from './../../../core/services/auth-service';
import { authInterceptor } from './../../../interceptor/auth-interceptor';
import { HouseService } from './../../service/index-service';
import { ReviewService } from './../../service/review-service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ICreateReview } from '../../interface/icreate-review';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AvatarPipe],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class Detail implements OnInit {

  isSubmitting: boolean = false;
  userId: number | null = null;
  selectedProperty: any;
  isLoggedIn = true;
  isLoading = false;
  currentSlideIndex = 0;
  CurrentUserData: CurrentUser | null = null;

  todayDate: string = new Date().toISOString().split('T')[0];


  newComment = {
    rating: 4,
    comment: '',
    roomTypeId: 0,
  };

  bookingForm = {
    checkIn: '',
    checkOut: '',
    guestCount: 1,
    notes: ''
  }

  constructor(
    private authService: AuthService,
    private reviewService: ReviewService,
    public HouseService: HouseService,
    private route: ActivatedRoute,
    private notification: NotificationService
  ) { }

  ngOnInit(): void {

    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.isLoggedIn = true;
        this.userId = user.id; // 這裡就是 MemberId！
        this.CurrentUserData = user;
      } else {
        this.isLoggedIn = false;
        this.userId = null;
        this.CurrentUserData = null;
      }
    });



    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchHouseDetail(id);
    }
  }

  submitComment() {
    console.log('點擊了按鈕！目前的 userId 是:', this.userId);

    if (!this.userId) {
      this.notification.show('請先登入', 'error');
      return;
    }
    console.log('當前登入的 userId:', this.userId);
    console.log('當前選中的房間資料:', this.selectedProperty);
    this.isSubmitting = true;

    // 依照組員解析出的 id 加上你要送出的資料
    const dto: ICreateReview = {
      roomTypeId: this.selectedProperty?.roomTypeId,
      rating: this.newComment.rating,
      comment: this.newComment.comment,
      memberId: this.userId, // 這裡用動態抓到的 userId
      bookingId: 0 // 後端會自動幫你找 validBookingId，這裡傳 0 即可 (或 DTO 設為可選)
    };
    console.log('準備送出的 DTO 全貌:', dto);
    this.reviewService.addReview(dto).subscribe({
      next: (res) => {
        this.notification.show('評論新增成功！', 'success');

        // 前端即時顯示 (提升使用者體驗)
        const newReview = {
          rating: this.newComment.rating,
          comment: this.newComment.comment,
          createdTime: new Date(),
          name: this.CurrentUserData?.name || '匿名使用者',// 顯示當前使用者名稱，或預設為匿名
          picture: this.CurrentUserData?.picture || '/user/default-avatar.png'
        };
        this.selectedProperty.reviews = [newReview, ...(this.selectedProperty.reviews || [])];

        this.newComment.comment = ''; // 清空輸入框
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('新增失敗', err);
        // 如果後端回傳 400 (沒資格)，錯誤訊息會在這裡噴出來
        this.notification.show(err.error?.message || '新增評論失敗，請確認您是否已完成住宿且尚未評價', 'error');
        this.isSubmitting = false;
      }
    });
  }

  //呼叫HouseDetail的APi
  private fetchHouseDetail(id: string) {
    this.isLoading = true;
    this.HouseService.getHouseDetail(id).subscribe({
      next: (data) => {
        this.selectedProperty = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('API Error:', err);
        this.isLoading = false;
      }
    });
  }

  // 計算平均評分
  getAverageRating(): string {
    const reviews = this.selectedProperty?.reviews;
    if (!reviews || reviews.length === 0) return '0.0';
    const total = reviews.reduce((sum: number, rv: any) => sum + rv.rating, 0);
    return (total / reviews.length).toFixed(1);
  }

  // 圖片輪播控制
  scrollIntoView(index: number) {
    this.currentSlideIndex = index;
    const id = 'slide' + index;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' });
    }
  }

  // 這兩個方法用來計算上一張和下一張的索引，讓輪播能無限循環
  getPrevIndex(): number {
    const total = this.selectedProperty?.allImages?.length || 0;
    return (this.currentSlideIndex === 0 ? total - 1 : this.currentSlideIndex - 1);
  }
  getNextIndex(): number {
    const total = this.selectedProperty?.allImages?.length || 0;
    return (this.currentSlideIndex === total - 1) ? 0 : this.currentSlideIndex + 1;
  }

  //評分分數的值
  rating(rating: number) {
    this.newComment.rating = rating;
  }

  //計算入住幾晚
  get totalNights(): number {
    const { checkIn, checkOut } = this.bookingForm;
    if (!checkIn || !checkOut) return 0;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    //設定零點處理，避免跨時區產生時間誤差
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - start.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays > 0 ? diffDays : 0;
  }

  //計算總金額
  get totalPrice(): number {
    const price = this.selectedProperty?.pricePerNight || 0;
    return this.totalNights * price;
  }

  onReserveClick() {
    // 檢查登入狀態
    if (!this.isLoggedIn) {
      this.notification.show('請先登入後再進行預約', 'error');
      // 如果你有做登入彈窗，可以在這裡觸發它，或者導向登入頁
      return;
    }

    // 檢查日期是否有選，且天數是否大於 0
    if (this.totalNights <= 0) {
      this.notification.show('請選擇正確的入住與退房日期', 'error');
      return;
    }

    // 檢查人數
    if (this.bookingForm.guestCount <= 0) {
      this.notification.show('請選擇入住人數', 'error');
      return;
    }

    // 打開確認預約的 Modal
    const modal = document.getElementById('confirm_modal') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }
  // 正式送出預約
  confirmAndCreateBooking() {
    this.isSubmitting = true;

    // 整理要送給後端的資料
    const dto = {
      roomTypeId: this.selectedProperty?.roomTypeId,
      memberId: this.userId, // 與評論一樣使用 userId
      checkInDate: this.bookingForm.checkIn,
      checkOutDate: this.bookingForm.checkOut,
      totalPrice: this.totalPrice,
      guestCount: this.bookingForm.guestCount,
      notes: this.bookingForm.notes
    };

    this.HouseService.createBooking(dto).subscribe({
      next: (res) => {
        // 關閉彈窗 (透過 ID 找到 Modal)
        const modal = document.getElementById('confirm_modal') as HTMLDialogElement;
        modal?.close();

        // 成功提示
        this.notification.show(`預約成功！您的訂單編號是：${res.bookingID}`, 'success');

        this.isSubmitting = false;

      },
      error: (err) => {
        console.error('預約失敗', err);
        this.notification.show('預約失敗，請稍後再試', 'error');
        this.isSubmitting = false;
      }
    });
  }
}
