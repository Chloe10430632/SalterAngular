import { MyCoachInfoS } from './../../../Service/my-coach-info';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormArray, FormBuilder } from '@angular/forms';
import { MyCoachEditS } from '../../../Service/my-coach-edit';
import { ActivatedRoute, Router } from '@angular/router';
import { SpecI } from '../../../Interfaces/SpecSport';
import { AvatarPipe } from '../../../../shared/pipes/avatar-pipe';

@Component({
  selector: 'app-myedit',
  standalone: true, // 確保是獨立組件
  imports: [ReactiveFormsModule, AvatarPipe],
  templateUrl: './myedit.html',
  styleUrl: './myedit.css',
})
export class Myedit implements OnInit {
  currentCoachId: string = '';
  selectedFile: File | null = null;
  allSpecialities: SpecI[] = [];
  cities: any[] = [];
  districtsByGroup: any[][] = [];

  // 💡 宣告一個變數來存教練資料，不要跟 Service 搞混
  coachInfoData: any = null;

  coachForm = new FormGroup({
    coachName: new FormControl('', [Validators.required]),
    avatarUrl: new FormControl(''),
    district: new FormArray([]),
    specialities: new FormControl<number[]>([]),
    introduction: new FormControl('', [Validators.required]),
  });

  get district() {
    return this.coachForm.get('district') as FormArray;
  }

  asGroup(control: any): FormGroup {
    return control as FormGroup;
  }

  constructor(
    private coacheditS: MyCoachEditS,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private myCoachInfoS: MyCoachInfoS, // 這是 Service
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.currentCoachId = this.activatedRoute.snapshot.params['id'];

    // 1. 抓取縣市清單
    this.coacheditS.getCityList().subscribe(res => {
      this.cities = Array.isArray(res) ? res : (res as any).data || [];
    });

    // 2. 抓取專業項目並接續抓取個人資料
    this.coacheditS.getSpecialityList().subscribe(list => {
      this.allSpecialities = list;

      if (this.currentCoachId) {
        this.coacheditS.getOriginInfo(this.currentCoachId).subscribe({
          next: (res: any) => {
            if (res.isSuccess) {
              const apiData = res.data;
              this.coachInfoData = apiData; // 存起來供 HTML 使用

              // 處理專業項目打勾
              const specIds = apiData.specialities.map((name: string) => {
                const found = this.allSpecialities.find(s => s.sportsName === name);
                return found ? found.id : null;
              }).filter((id: any) => id !== null);

              // 填入表單
              this.coachForm.patchValue({
                coachName: apiData.coachName || apiData.name,
                introduction: apiData.introduction,
                specialities: specIds,
                avatarUrl: apiData.avatarUrl // 💡 這裡一定要塞值給 form，Pipe 才有東西噴
              });

              // 3. 處理地區回填
              if (apiData.serviceLocations && apiData.serviceLocations.length > 0) {
                apiData.serviceLocations.forEach((loc: any, index: number) => {
                  this.addDistrictGroup(loc.cityId, loc.districtId);
                });
              } else {
                this.addDistrictGroup();
              }
            }
          }
        });
      } else {
        this.addDistrictGroup();
      }
    });
  }

  addDistrictGroup(initialCityId: number | null = null, initialDistrictId: number | null = null) {
    const group = new FormGroup({
      cityId: new FormControl(initialCityId),
      districtId: new FormControl(initialDistrictId, [Validators.required])
    });

    const index = this.district.length;
    this.district.push(group);
    this.districtsByGroup.push([]);

    if (initialCityId) {
      this.coacheditS.getDistrictsByCity(initialCityId).subscribe((res: any) => {
        const districts = res.isSuccess ? res.data : res;
        this.districtsByGroup[index] = Array.isArray(districts) ? districts : [];
        // 確保清單載入後，值能被選中
        group.get('districtId')?.setValue(initialDistrictId);
      });
    }
  }

  // ... 剩下的 onCityChange, onSave, onFileSelected, isSelected, onSpecChange 保持不變 ...
  onCityChange(index: number) {
    const cityId = this.district.at(index).get('cityId')?.value;
    if (cityId) {
      this.coacheditS.getDistrictsByCity(cityId).subscribe((res: any) => {
        const districts = res.isSuccess ? res.data : res;
        this.districtsByGroup[index] = Array.isArray(districts) ? districts : [];
        this.district.at(index).get('districtId')?.setValue(null);
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.coachForm.patchValue({ avatarUrl: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  isSelected(specId: number): boolean {
    const currentSpecs = this.coachForm.get('specialities')?.value as number[] || [];
    return currentSpecs.includes(specId);
  }

  onSpecChange(specId: number) {
    const control = this.coachForm.get('specialities');
    let current = control?.value as number[] || [];
    if (current.includes(specId)) {
      current = current.filter(id => id !== specId);
    } else {
      current = [...current, specId];
    }
    control?.setValue(current);
  }

  island() {
    this.route.navigate(['/experience/coachisland']);
  }
}
