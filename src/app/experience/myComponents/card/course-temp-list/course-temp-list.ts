import { NotificationService } from './../../../../shared/notifyService/notification-service';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { debounceTime, switchMap, distinctUntilChanged } from 'rxjs';
import { CourseInformationS } from '../../../Service/course-information';
import { TempInfoI } from '../../../Interfaces/IICourse';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocationSearchService } from '../../../../trip/services/location-search';
import { PhotoI } from '../../../Interfaces/IIPhoto';
import flatpickr from 'flatpickr';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
//===============!!這是子 元件!!=======================//
//===============!! 課程模板 !!=======================//

@Component({
  selector: 'app-course-temp-list',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course-temp-list.html',
  styleUrl: './course-temp-list.css',
})
//========!!這是 子 元件!!================//
//========!!課程模板!!================//
//=========展示+編輯+上架==========//

export class CourseTempList implements OnInit {
  isEdit: boolean = false;
  isSaving: boolean = false;
  isSelectingTime = false;
  locationResults: any[] = [];
  newPhotos: File[] = [];
  previewUrls: string[] = [];
  private carouselTimer: any;

  editForm = new FormGroup({
    title: new FormControl(''),
    price: new FormControl(0),
    description: new FormControl(''),
    difficulty: new FormControl(''),
    location: new FormControl(''),
    photoUrls: new FormControl<string[]>([]),
  });

  sessionForm = new FormGroup({
    selectedDates: new FormControl<string[]>([], Validators.required),
    timeSlot: new FormControl('早上場(9:00~12:00)', Validators.required),
    maxParticipants: new FormControl(1, Validators.min(1))
  });
  //--------------------------------------//
  constructor(private localS: LocationSearchService,
    private courseS: CourseInformationS,
    private notifyS: NotificationService,
    private router: Router
  ) { }
  //--------------------------------------//
  ngOnInit(): void {
    this.localS.init();
    console.log('tempData:', this.tempData);
    // 監聽地址輸入框，自動搜尋
    this.editForm.get('location')?.valueChanges.pipe(
      debounceTime(300), // 等使用者停下 0.3 秒才搜尋，省資源
      distinctUntilChanged(),
      switchMap(value => this.localS.search(value || ''))
    ).subscribe(results => {
      this.locationResults = results;
    });
  }
  ngAfterViewInit() {
    this.initAutoPlay();
  }
  ngOnDestroy() {
    if (this.carouselTimer) clearInterval(this.carouselTimer);
  }
  //--------------------------------------//
  @Input() tempData: TempInfoI | null = null;
  @Output() saved = new EventEmitter<void>();
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.isEdit) {
      // 只要回傳 false 或設定 returnValue，瀏覽器就會跳出內建警告
      $event.returnValue = true;
    }
  }
  @ViewChild('carousel') carouselElement?: ElementRef;
  @ViewChild('datePicker') datePickerElement!: ElementRef;
  //--------------------------------------//
  //#region 地點
  onSelectLocation(item: any) {
    this.localS.getDetails(item).subscribe(detail => {
      // 填入完整的地址文字
      this.editForm.patchValue({ location: detail.name + ' ' + detail.addressText });
      this.locationResults = []; // 清空清單
    });
  }
  removePhoto(index: number, isExisting: boolean) {
    if (isExisting) {
      this.tempData?.imageUrls?.splice(index, 1);
    } else {
      this.previewUrls.splice(index, 1);
      this.newPhotos.splice(index, 1);
    }
  }
  //#endregion
  //#region 圖片
  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.newPhotos.push(file); // 存進要送出的檔案陣列

        // 製作預覽圖，讓使用者馬上看到
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrls.push(e.target.result); // 存進預覽網址陣列
        };
        reader.readAsDataURL(file);
      }
    }
  }
  initAutoPlay() {
    this.carouselTimer = setInterval(() => {
      const el = this.carouselElement?.nativeElement;
      if (!el || this.isEdit) return;

      const itemWidth = el.clientWidth;
      const totalWidth = el.scrollWidth;
      const currentScroll = el.scrollLeft;

      if (currentScroll + itemWidth >= totalWidth - 15) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollTo({ left: currentScroll + itemWidth, behavior: 'smooth' });
      }
    }, 2500); // 建議改成3秒，1秒太快了
  }
  //#endregion
  //#region 時段
  selectime() {
    this.isSelectingTime = true;
    // 給 Angular 一點時間渲染 DOM
    setTimeout(() => {
      if (this.datePickerElement) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 60);

        flatpickr(this.datePickerElement.nativeElement, {
          mode: "single",
          minDate: tomorrow,
          maxDate: maxDate,
          dateFormat: "Y-m-d",
          onChange: (selectedDates: Date[]) => {
            if (selectedDates.length === 1) {
              const date = selectedDates[0];
              const yyyy = date.getFullYear();
              const mm = String(date.getMonth() + 1).padStart(2, '0');
              const dd = String(date.getDate()).padStart(2, '0');
              const formatted = `${yyyy}-${mm}-${dd}`;

              this.sessionForm.controls.selectedDates.setValue([formatted]); // 陣列裡只有一天
            }
          }
        });
      }
    }, 150);
  }
  onCancelTime() {
    this.isSelectingTime = false;

    this.sessionForm.controls.selectedDates.setValue([]);
    this.sessionForm.reset({
      timeSlot: '早上場(9:00~12:00)',
      maxParticipants: 1
    });
    this.sessionForm.controls.selectedDates.setValue([]);
  }
  isPastDate(dateStr: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateStr) < today;
  }
  //#endregion
  //--------------------------------------//
  onEdit() {
    this.isEdit = true;
    if (this.tempData) {
      const existingPhotos = this.tempData.imageUrls || this.tempData.photoUrls || [];

      this.editForm.patchValue({
        title: this.tempData?.title,
        price: this.tempData?.price,
        description: this.tempData?.description,
        difficulty: this.tempData?.difficulty,
        location: this.tempData?.location,
      })
      this.previewUrls = [];
      this.newPhotos = [];
    }
  }
  onCancel() {
    this.isEdit = false;
  }


  onSave() {
    const formData = new FormData();
    const id = this.tempData?.tempId;

    if (!id) {
      console.error("錯誤：templateId 為 undefined。請檢查父組件傳入的 tempData：", this.tempData);
      this.notifyS.show("找不到模板", "error");
      return;
    }

    // 1. 加入文字欄位-FormData 欄位名稱必須跟後端 API 的 Model 完全一致
    formData.append('Title', this.editForm.get('title')?.value || '');
    formData.append('Price', this.editForm.get('price')?.value?.toString() || '0');
    formData.append('Description', this.editForm.get('description')?.value || '');
    formData.append('Difficulty', this.editForm.get('difficulty')?.value || '');
    formData.append('Location', this.editForm.get('location')?.value || '');

    //3.圖片
    this.newPhotos.forEach((file) => {
      formData.append('NewImageFiles', file, file.name);
    });
    const remainingPhotos = (this.tempData?.imageUrls ?? []).map(p => ({
      photoUrl: p.photoUrl,
      publicId: p.publicId
    }));
    formData.append('ExistingPhotosJson', JSON.stringify(remainingPhotos));

    this.isSaving = true;
    // 4. 送出！
    this.courseS.editCourseT(id, formData).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.isEdit = false;

          if (this.tempData) {// 把新資料寫回畫面上的 tempData
            Object.assign(this.tempData, this.editForm.value);
            const existing = this.tempData.imageUrls ?? [];
            const newOnes: PhotoI[] = this.previewUrls.map(url => ({
              photoUrl: url,
              publicId: ''
            }));
            this.tempData.imageUrls = [...existing, ...newOnes];
          }
          this.newPhotos = [];
          this.previewUrls = [];
          this.notifyS.show("儲存成功", "success")
        }
        this.isSaving = false;
      },
      error: (err) => {
        console.error("API 報錯：", err);
        this.notifyS.show("儲存失敗", "error")
        this.isSaving = false;
      }
    });
  }
  //------------------------------------------------//
  onSaveSession() {
    const formData = new FormData();
    const id = this.tempData?.tempId;

    // 1. 檢查模板 ID 是否存在
    if (!id) {
      console.error("錯誤：templateId 為 undefined。請檢查父組件傳入的 tempData：", this.tempData);
      this.notifyS.show("找不到模板", "error");
      return;
    }

    // 2. 取得表單數值
    const dates = this.sessionForm.controls.selectedDates.value || [];
    const slot = this.sessionForm.controls.timeSlot.value || '';
    const maxStu = this.sessionForm.controls.maxParticipants.value ?? 0; // 使用 ?? 處理 null/undefined

    // 3. 組裝 FormData (注意：欄位名稱需與後端 API 參數一致)
    formData.append('StartDate', dates[0]);
    formData.append('TimeSlot', slot);
    formData.append('maxParticipants', maxStu.toString());

    this.isSaving = true;

    // 4. 呼叫 Service API 進行上架
    this.courseS.createSession(id, formData).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.isSelectingTime = false;

          // 使用 SweetAlert2 詢問後續動作
          Swal.fire({
            title: '上架成功！',
            text: '課程已成功發布，要前往查看嗎？',
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#facc15', // Bumblebee 黃
            cancelButtonColor: '#5b2305',
            confirmButtonText: '前往「上架中」頁面',
            cancelButtonText: '留在原地新增下一筆'
          }).then((result) => {
            if (result.isConfirmed) {
              // 跳轉到你剛寫好的那個父元件路由
              this.router.navigate(['/experience/course']);
            } else {
              // 留在原地，重置表單
              this.sessionForm.reset({
                timeSlot: '早上場(9:00~12:00)',
                maxParticipants: 1
              });
              // 重置後記得手動清空 selectedDates，因為它是陣列
              this.sessionForm.controls.selectedDates.setValue([]);
            }
          });
        }
        else {
          // ✅ 情況 B：後端回 200 但衝堂
          this.isSaving = false;
          Swal.fire({
            title: '此時段已有課程！',
            text: res.message ?? '請選擇其他日期或時段',
            icon: 'warning',
            confirmButtonColor: '#facc15',
            confirmButtonText: '重新選擇'
          });
        }
        this.isSaving = false; // API 完成後解除讀取狀態
      },
      error: (err) => {
        // 後端回 400/409
        const msg = err?.error?.message ?? err?.message ?? '此時段已有課程，請重新選擇';
        Swal.fire({
          title: '時段衝突！',
          text: msg,
          icon: 'warning',
          confirmButtonColor: '#facc15',
          confirmButtonText: '重新選擇'
        });
        this.isSaving = false;
      }
    });

    // 調試用途
    console.log("新增時段內容：", { id, dates, slot, maxStu });
  }
}
