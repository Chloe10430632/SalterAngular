import { Component } from '@angular/core';
import { Withavatar } from "../../myComponents/container/withavatar/withavatar";
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Footer } from "../../../shared/footer/footer";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

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
  isSaving = false;
  //-----------------------------------//
  constructor(private fb: FormBuilder) {
    this.createForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      location: [''],
      price: [0, [Validators.min(0)]],
      difficulty: ['初級']
    });
  }
  //-----------------------------------//
  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.previewUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }

  removePhoto(index: number) {
    this.previewUrls.splice(index, 1);
  }

  onSelectLocation(item: any) {
    this.createForm.patchValue({ location: item.name });
    this.locationResults = [];
  }

  onCreate() {
    if (this.createForm.valid) {
      this.isSaving = true;
      console.log('提交資料：', this.createForm.value);
      // 模擬 API 調用
      setTimeout(() => {
        this.isSaving = false;
        alert('課程模板建立成功！');
      }, 1500);
    }
  }

  onCancel() {
    this.createForm.reset({ difficulty: '初級', price: 0 });
    this.previewUrls = [];
  }
}
