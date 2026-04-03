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
    maxStudents: new FormControl(1, Validators.min(1))
  });
  //--------------------------------------//
  constructor(private localS: LocationSearchService,
    private courseS: CourseInformationS,
    private notifyS: NotificationService,
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

      const itemWidth = el.offsetWidth;
      const totalWidth = el.scrollWidth;
      const currentScroll = el.scrollLeft;
      const isAtEnd = currentScroll + itemWidth >= totalWidth - 5; // 加5px容錯

      if (isAtEnd) {
        // 回到第一張
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: itemWidth, behavior: 'smooth' });
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
        flatpickr(this.datePickerElement.nativeElement, {
          mode: "multiple",
          dateFormat: "Y-m-d",
          onChange: (dates, dateStr) => {
            // dateStr 會是 "2024-01-01, 2024-01-02"
            const dateArr = dateStr ? dateStr.split(', ') : [];
            this.sessionForm.controls.selectedDates.setValue(dateArr);
          }
        });
      }
    }, 100);
  }
  onCancelTime() {
    this.isSelectingTime = false;
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
      },
      error: (err) => {
        console.error("API 報錯：", err);
        this.notifyS.show("儲存失敗", "error")
      }
    });
    this.isSaving = true;
    setTimeout(() => {
      // API 成功後
      this.isSaving = false;
      this.isEdit = false;
    }, 2000);
    console.log("修改資料", this.editForm.value);
  }
  //------------------------------------------------//
  onSaveSession() {
    const formData = new FormData();
    const id = this.tempData?.tempId;

    if (!id) {
      console.error("錯誤：templateId 為 undefined。請檢查父組件傳入的 tempData：", this.tempData);
      this.notifyS.show("找不到模板", "error");
      return;
    }

    const dates = this.sessionForm.controls.selectedDates.value || [];
    const slot = this.sessionForm.controls.timeSlot.value || '';
    const maxStu = this.sessionForm.controls.maxStudents.value ?? 0; // 使用 ?? 處理 null/undefined

    formData.append('SelectedDates', JSON.stringify(dates));
    formData.append('TimeSlot', slot);
    formData.append('MaxStudents', maxStu.toString());

    this.isSaving = true;

    this.courseS.createSession(id, formData).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.isSelectingTime = false;
          this.notifyS.show("儲存成功", "success")
        }
        this.isSaving = false;
      },
      error: (err) => {
        console.error("API 報錯：", err);
        this.notifyS.show("儲存失敗", "error")
      }
    });
    this.isSaving = true;
    setTimeout(() => {
      // API 成功後
      this.isSaving = false;
      this.isEdit = false;
    }, 2000);
    console.log("新增時段", this.editForm.value);
  }
}
