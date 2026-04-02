import { NotificationService } from './../../../shared/notifyService/notification-service';
import { Component } from '@angular/core';
import { Withavatar } from "../../myComponents/container/withavatar/withavatar";
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Footer } from "../../../shared/footer/footer";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LocationSearchService } from '../../../trip/services/location-search';
import { CourseInformationS } from '../../Service/course-information';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Router } from '@angular/router';

//===========!!父 元件!!==================//
//==========!!新增課程模板!!===========//
@Component({
  selector: 'app-coach-course-add-temp',
  imports: [Withavatar, LittleIsland, Footer, CommonModule, ReactiveFormsModule],
  templateUrl: './coach-course-add-temp.html',
  styleUrl: './coach-course-add-temp.css',
})
export class CoachCourseAddTemp {
  createForm: FormGroup;
  previewUrls: string[] = [];
  locationResults: any[] = []; // 模擬地址搜尋結果
  selectedFiles: File[] = [];
  isSaving = false;
  //-----------------------------------//
  constructor(private fb: FormBuilder,
    private locationSvc: LocationSearchService,
    private courseSvc: CourseInformationS,
    private notifyS: NotificationService,
    private router: Router
  ) {
    this.createForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      location: [''],
      price: ['', [Validators.required]],
      difficulty: ['初級']
    });
  }
  //-----------------------------------//
  ngOnInit() {
    // 1. 初始化 Google 地圖服務
    this.locationSvc.init();

    // 2. 監聽地點輸入框，實作自動搜尋
    this.createForm.get('location')?.valueChanges.pipe(
      debounceTime(300), // 等使用者停下來 0.3 秒再搜，比較省資源
      distinctUntilChanged(),
      switchMap(value => this.locationSvc.search(value))
    ).subscribe(results => {
      this.locationResults = results;
    });
  }
  //-----------------------------------//
  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        this.selectedFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => this.previewUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }

  removePhoto(index: number) {
    this.previewUrls.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  onSelectLocation(item: any) {
    this.locationSvc.getDetails(item).subscribe(detail => {
      this.createForm.patchValue({ location: detail.name }, { emitEvent: false });
      this.locationResults = [];
    });
  }

  onCreate() {
    if (this.createForm.valid && !this.isSaving) {
      this.isSaving = true;

      // 使用 FormData 包裝檔案與資料
      const formData = new FormData();
      Object.keys(this.createForm.value).forEach(key => {
        formData.append(key, this.createForm.get(key)?.value);
      });
      this.selectedFiles.forEach(file => formData.append('PhotoUrls', file));

      this.courseSvc.createCourseT(formData).subscribe({
        next: () => {
          this.isSaving = false;
          this.notifyS.show('課程模板建立成功！', "success");
          this.router.navigate(['/experience/coursetemp']);
        },
        error: () => this.isSaving = false
      });
    }
  }

  onCancel() {
    this.createForm.reset({ difficulty: '初級', price: 0 });
    this.previewUrls = [];
    this.selectedFiles = [];
  }
}
