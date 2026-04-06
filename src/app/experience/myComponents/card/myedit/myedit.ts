import { NotificationService } from './../../../../shared/notifyService/notification-service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { SpecI } from '../../../Interfaces/IISpecSport';
import { APIResponse, CoachAllInfoI } from '../../../Interfaces/IIcoachAllinfo';
import { DistI } from '../../../Interfaces/IIDistrict';
import { CoachS } from '../../../Service/coach-s';
import { CoachCardInfoS } from '../../../Service/coach-card-info-s';


//===========!!子 Component!!================//
//============編輯教練資料=================//
@Component({
  selector: 'app-myedit',
  imports: [ReactiveFormsModule],
  templateUrl: './myedit.html',
  styleUrl: './myedit.css',
})
export class Myedit implements OnInit {
  currentCoachId: string = '';
  selectedFile: File | null = null;
  allSpecialities: SpecI[] = [];
  cities: any[] = [];
  districtsByGroup: any[] = []; // 用來存每一組對應的區域清單
  defaultAvatar = 'https://res.cloudinary.com/dnqawxc59/image/upload/v1774857067/%E8%9E%A2%E5%B9%95%E6%93%B7%E5%8F%96%E7%95%AB%E9%9D%A2_2026-03-30_155018_pbwyxk.png';
  previewImage: string | null = null;

  coachForm = new FormGroup({
    coachName: new FormControl('', [Validators.required]),
    avatarUrl: new FormControl(''),
    district: new FormArray([]),
    specialities: new FormControl<number[]>([]),
    introduction: new FormControl('', [Validators.required]),
  })
  //============================================//
  get district() {
    return this.coachForm.get('district') as unknown as FormArray;
  }
  // 為了讓模板更安全，我們新增一個小工具方法來幫 group 轉型
  asGroup(control: any): FormGroup {
    return control as FormGroup;
  }
  //===========================================//
  constructor(
    private coachS: CoachS,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private coachCardS: CoachCardInfoS,
    private fb: FormBuilder,
    private notifycationS: NotificationService
  ) { }
  //===========================================//

  ngOnInit(): void {
    this.currentCoachId = this.activatedRoute.snapshot.params['id'];
    //抓取縣市清單
    this.coachS.getCityList().subscribe(res => {
      const raw = res as any;
      this.cities = raw.data ?? raw ?? [];
      console.log('縣市清單已載入', this.cities);
    });
    // 1. 先抓「所有專業項目清單」
    this.coachS.getSpecialityList().subscribe(res => {
      this.allSpecialities = Array.isArray(res) ? res : (res as any).data || [];
      console.log('專業清單已載入', this.allSpecialities);

      // 2. 清單拿到了，才去抓「教練個人資料」
      if (this.currentCoachId) {
        this.coachS.getCoachInfoStr(this.currentCoachId).subscribe({
          next: (res: APIResponse<CoachAllInfoI>) => {
            if (res.data) {
              const apiData = res.data; console.log("教練個人資料:", res);

              const specIds = apiData.specialities.map((name: string) => {
                const found = this.allSpecialities.find(s => s.sportsName === name);
                return found ? found.id : null;
              }).filter((id: number | null) => id !== null);
              console.log("專業對應 ID 清單:", specIds);

              //抓原本頭像
              if (apiData.avatarUrl) {
                this.previewImage = apiData.avatarUrl;
              }


              // 3. 填入表單
              this.coachForm.patchValue({
                coachName: apiData.coachName,
                introduction: apiData.introduction,
                specialities: specIds,
              });
              // 處理地區回填
              this.district.clear();
              if (apiData.districtId) {
                // 先用 districtId 去抓所有縣市的 districts，找到對應的 cityId
                this.addDistrictGroup(apiData.cityId, apiData.districtId);

                // 如果 cityId 是 null，等縣市清單載入後再反查
                if (!apiData.cityId) {
                  // 需要遍歷所有縣市去找，比較麻煩
                }
              } else {
                this.addDistrictGroup();
              }
            }
          }
        });
      }
      else {
        console.log('沒有教練 ID，表單保持空白');
      }
    });
  }
  //===========================================//
  //#region 地區相關邏輯
  //  新增一組地區選單
  addDistrictGroup(initialCityId: number | null = null, initialDistrictId: number | null = null) {
    const group = new FormGroup({
      cityId: new FormControl(initialCityId),
      districtId: new FormControl(initialDistrictId)
    });

    const index = this.district.length;
    this.districtsByGroup[index] = []; // ✅ 先給空陣列
    this.district.push(group);

    if (initialCityId) {
      this.coachS.getDistrictsByCity(initialCityId).subscribe((res: any) => {
        const updated = [...this.districtsByGroup];
        updated[index] = Array.isArray(res.data) ? res.data : [];  // 取 res.data
        this.districtsByGroup = updated;
      });
    }

  }

  //  刪除一組地區
  removeDistrictGroup(index: number) {
    this.district.removeAt(index);
    this.districtsByGroup.splice(index, 1);
  }

  //  當縣市選單切換時
  onCityChange(index: number) {
    const cityId = this.district.at(index).get('cityId')?.value;

    if (cityId) {
      this.coachS.getDistrictsByCity(cityId).subscribe({
        next: (res: any) => {  // 改成 any 避免型別衝突
          const updated = [...this.districtsByGroup];
          updated[index] = Array.isArray(res.data) ? res.data : [];  // 取 res.data
          this.districtsByGroup = updated;
          this.district.at(index).get('districtId')?.setValue(null);
          console.log('API 回傳的 res 型別:', typeof res, Array.isArray(res), res);
        },
        error: (err) => {
          console.error('抓取區域失敗', err);
          this.notifycationS.show('抓取區域失敗，請稍後再試');
        }
      });
    } else {
      const updated = [...this.districtsByGroup];
      updated[index] = [];
      this.districtsByGroup = updated;
    }
  }

  //#endregion

  onSave() {
    const coachId = this.currentCoachId;
    if (coachId) {
      this.route.navigate(['/experience/coachpfe', coachId]);
    } else {
      this.route.navigate(['/experience/coachpfe']);
    }

    console.log('表單狀態:', this.coachForm.valid);
    console.log('表單錯誤:', this.coachForm.errors);
    Object.keys(this.coachForm.controls).forEach(key => {
      const ctrl = this.coachForm.get(key);
      console.log(`${key} => valid: ${ctrl?.valid}, value:`, ctrl?.value, 'errors:', ctrl?.errors);
    });
    // district 內部每一組也檢查
    this.district.controls.forEach((group, i) => {
      const g = group as FormGroup;
      Object.keys(g.controls).forEach(key => {
        console.log(`district[${i}].${key} => valid: ${g.get(key)?.valid}, value:`, g.get(key)?.value, 'errors:', g.get(key)?.errors);
      });
    });
    //================
    if (this.coachForm.valid) {
      const formData = new FormData();
      const rawValue = this.coachForm.getRawValue();

      // 1. 填入基本資料
      formData.append('Name', rawValue.coachName || '');
      formData.append('Introduction', rawValue.introduction || '');
      const selectedDistIds = (this.coachForm.getRawValue().district as any[])
        .map(item => item.districtId)
        .filter(id => id !== null && id !== undefined);
      selectedDistIds.forEach(id => formData.append('DistrictId', id.toString()));
      const selectedSpecs = this.coachForm.getRawValue().specialities as number[] || [];
      selectedSpecs.forEach(id => formData.append('SpecialityIds', id.toString()));


      // 3. 處理圖片
      if (this.selectedFile) {
        formData.append('AvatarFile', this.selectedFile);
      }

      // 4. 根據「有無 ID」決定動作
      if (this.currentCoachId) {
        // --- 情況 A：編輯既有教練 ---
        this.coachS.editMyInfo(this.currentCoachId, formData).subscribe({
          next: (res: any) => {
            console.log('更新成功：', res);
            this.notifycationS.show('教練資料更新成功！', "success");
            this.island(); // 跳轉回小島
          },
          error: (err) => {
            console.error('更新失敗：', err);
            this.notifycationS.show('更新失敗，請檢查網路或欄位格式', "error");
          }
        });
      } else {
        // --- 情況 B：申請成為新教練 ---
        this.coachS.createMyInfo(formData).subscribe({
          next: (res: any) => {
            console.log('申請成功：', res);
            this.notifycationS.show('恭喜！申請教練成功！', "success");
            this.island(); // 跳轉回小島
          },
          error: (err) => {
            console.error('申請失敗：', err);
            this.notifycationS.show('申請失敗，可能您已經是教練，或資料填寫不全', "error");
          }
        });
      }
    } else {
      this.notifycationS.show('error');

    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  // 檢查某個運動 ID 是否在教練的專業清單中
  isSelected(specId: number): boolean {
    const currentSpecs = this.coachForm.get('specialities')?.value as number[] || [];
    // 這裡要看你存的是 ID 還是名稱，建議存 ID
    return currentSpecs.includes(specId);
  }
  // 處理勾選專業邏輯
  onSpecChange(specId: number) {
    const control = this.coachForm.get('specialities');
    let current = control?.value as number[] || [];

    if (current.includes(specId)) {
      current = current.filter(id => id !== specId);
    } else {
      current = [...current, specId];
    }
    control?.setValue(current);
    control?.markAsDirty();
  }
  //===========================================//
  island() {
    this.route.navigate(['/experience/coachisland']);
  }
}

