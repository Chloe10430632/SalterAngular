import { NotificationService } from './../../../../shared/notifyService/notification-service';
import { MyCoachInfoS } from './../../../Service/my-coach-info';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormArray, FormBuilder } from '@angular/forms';
import { MyCoachEditS } from '../../../Service/my-coach-edit';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { SpecI } from '../../../Interfaces/SpecSport';


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
    private coacheditS: MyCoachEditS,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private myCoachInfoS: MyCoachInfoS,
    private fb: FormBuilder,
    private notifycationS: NotificationService
  ) { }
  //===========================================//

  ngOnInit(): void {
    this.currentCoachId = this.activatedRoute.snapshot.params['id'];
    //抓取縣市清單
    this.coacheditS.getCityList().subscribe(res => {
      this.cities = Array.isArray(res) ? res : (res as any).data || [];
      console.log('縣市清單已載入', this.cities);
    });
    // 1. 先抓「所有專業項目清單」
    this.coacheditS.getSpecialityList().subscribe(list => {
      this.allSpecialities = list;
      console.log('1. 專業清單已載入', this.allSpecialities);

      // 2. 清單拿到了，才去抓「教練個人資料」
      if (this.currentCoachId) {
        this.coacheditS.getOriginInfo(this.currentCoachId).subscribe({
          next: (res: any) => {
            if (res.isSuccess) {
              const apiData = res.data;

              // ⭐ 關鍵：把 ["衝浪", "SUP"] 轉換成 [1, 2] (ID 陣列)
              const specIds = apiData.specialities.map((name: string) => {
                const found = this.allSpecialities.find(s => s.sportsName === name);
                return found ? found.id : null;
              }).filter((id: any) => id !== null);

              // 3. 填入表單
              this.coachForm.patchValue({
                coachName: apiData.coachName || apiData.name,
                introduction: apiData.introduction,
                specialities: specIds, // 這裡現在是 [1, 2, 3] 了，Checkbox 會乖乖打勾！
              });
              // 處理地區回填 (假設 API 回傳 districtIds: [1, 5, 10])
              if (apiData.districtIds && apiData.districtIds.length > 0) {
                apiData.districtIds.forEach((dId: number, index: number) => {
                  this.addDistrictGroup(dId);
                });
              } else {
                this.addDistrictGroup(); // 若無資料，預設給一組空的
              }

            }
          }
        });
      }
      else {
        // 【新增】 新增模式預設給一組選單
        this.addDistrictGroup();
      }
    });
  }
  //===========================================//
  //#region 地區相關邏輯
  // 【新增方法】 新增一組地區選單
  addDistrictGroup(initialCityId: number | null = null, initialDistrictId: number | null = null) {
    const group = new FormGroup({
      cityId: new FormControl(initialCityId),
      districtId: new FormControl(initialDistrictId, [Validators.required])
    });

    const index = this.district.length;
    this.district.push(group);
    this.districtsByGroup.push([]);

    // 💡 如果有初始縣市，立刻抓取該縣市的區域清單，否則區域選單會是空的
    if (initialCityId) {
      this.coacheditS.getDistrictsByCity(initialCityId).subscribe((res: any) => {
        this.districtsByGroup[index] = res.isSuccess ? res.data : res;
      });
    }
  }

  // 【新增方法】 刪除一組地區
  removeDistrictGroup(index: number) {
    this.district.removeAt(index);
    this.districtsByGroup.splice(index, 1);
  }

  // 【新增方法】 當縣市選單切換時
  onCityChange(index: number) {
    // 1. 從正確的 index 拿到該組的 cityId
    const cityId = this.district.at(index).get('cityId')?.value;

    console.log('選中的縣市 ID 是：', cityId); // 這裡可以用來檢查有沒有抓到數字

    if (cityId) {
      this.coacheditS.getDistrictsByCity(cityId).subscribe({
        next: (res: any) => {
          // 2. 根據你的 API 回傳結構，通常 res.data 才是陣列
          const districts = res.isSuccess ? res.data : res;

          // 3. 塞入對應位置的區域清單
          this.districtsByGroup = res.success ? res.data : res;
          // console.log(this.districtsByGroup);

          // 4. 重置該組的區域選擇（因為換縣市了，舊的區域要清空）
          this.district.at(index).get('districtId')?.setValue(null);
        },
        error: (err) => {
          console.error('抓取區域失敗，錯誤訊息：', err);
          this.notifycationS.show('抓取區域失敗，請檢查網路！');
        }
      });
    }
  }

  //#endregion

  onSave() {
    if (this.coachForm.valid) {
      const formData = new FormData();
      const rawValue = this.coachForm.getRawValue();

      // 1. 填入基本資料
      formData.append('Name', rawValue.coachName || '');
      formData.append('Introduction', rawValue.introduction || '');

      const selectedIds = this.district.value
        .map((item: any) => item.districtId)
        .filter((id: any) => id !== null);

      // 2. 處理專業項目 (對應後端 List<int> SpecialityIds)
      const selectedSpecs = rawValue.specialities as number[] || [];
      selectedSpecs.forEach(id => {
        formData.append('SpecialityIds', id.toString());
      });

      // 3. 處理圖片
      if (this.selectedFile) {
        formData.append('AvatarFile', this.selectedFile);
      }

      // 4. 根據「有無 ID」決定動作
      if (this.currentCoachId) {
        // --- 情況 A：編輯既有教練 ---
        this.coacheditS.updateCoach(this.currentCoachId, formData).subscribe({
          next: (res: any) => {
            console.log('更新成功：', res);
            alert('教練資料更新成功！');
            this.island(); // 跳轉回小島
          },
          error: (err) => {
            console.error('更新失敗：', err);
            alert('更新失敗，請檢查網路或欄位格式');
          }
        });
      } else {
        // --- 情況 B：申請成為新教練 ---
        this.myCoachInfoS.createMyInfo(formData).subscribe({
          next: (res: any) => {
            console.log('申請成功：', res);
            alert('恭喜！申請教練成功！');
            this.island(); // 跳轉回小島
          },
          error: (err) => {
            console.error('申請失敗：', err);
            alert('申請失敗，可能您已經是教練，或資料填寫不全');
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

