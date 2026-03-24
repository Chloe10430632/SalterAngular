import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-house',
  imports: [FormsModule],
  templateUrl: './update-house.html',
  styleUrl: './update-house.css',
})
export class UpdateHouse implements OnInit {
  // 1. 定義表單結構
  houseForm: any = {
    roomTypeId: 0,
    roomName: '',
    citie: '',
    district: '',
    location: '',
    pricePerNight: 0,
    capacity: 2,
    houseDescription: '',
    roomDescription: '',
    amenityIds: []
  };

  amenityList: any[] = [];

  rawImageUrls: string = ''; // 給 textarea 用的換行字串
  isLoading = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute, // 用來抓 URL 裡的 ID
    private router: Router
  ) { }

  ngOnInit() {

    // 先抓所有設施
    this.http.get<any[]>('https://localhost:7017/api/Home/amenities').subscribe(res => {
      this.amenityList = res;
    });

    // 從路由抓 ID (例如: /edit/101)
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadHouseData(id);
    }
  }

  // 2. 【載入】呼叫你之前寫好的 GET Detail API
  loadHouseData(id: number) {
    this.http.get<any>(`https://localhost:7017/api/Home/${id}`).subscribe({
      next: (data) => {
        // 將後端抓回來的 DTO 塞進 houseForm
        this.houseForm = {
          roomTypeId: data.roomTypeId,
          roomName: data.name,
          citie: data.citie,
          district: data.district,
          location: data.location,
          pricePerNight: data.pricePerNight,
          capacity: data.capacity,
          houseDescription: data.houseDescription,
          roomDescription: data.roomDescription,
          amenityIds: data.amenityIds || []
        };
        // 圖片處理：將陣列轉成換行字串顯示在 Textarea
        if (data.allImages) {
          this.rawImageUrls = data.allImages.join('\n');
        }
      },
      error: (err) => alert('抓不到資料，請檢查 ID 是否正確')
    });
  }

  // 3. 【送出】呼叫你剛寫好的 PUT/POST Update API
  onSubmit() {
    this.isLoading = true;

    // 處理圖片：把 Textarea 的換行字串轉回陣列，並對齊後端 DTO 叫 ImageUrls
    const images = this.rawImageUrls.split('\n').filter(u => u.trim() !== '');

    // 組裝最終送出的物件
    const finalPayload = {
      ...this.houseForm,
      imageUrls: images // 這裡一定要叫 imageUrls，對齊你的後端 DTO
    };

    this.http.put('https://localhost:7017/api/Home/update-full-house', finalPayload)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          alert('房源資料補齊成功！');
          this.router.navigate(['/']); // 成功後導回列表
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);
          alert('更新失敗：' + (err.error?.message || '伺服器錯誤'));
        }
      });
  }

  // 設備勾選邏輯 (直接複製 Create 的即可)
  onAmenityChange(event: any, id: number) {
    if (event.target.checked) {
      // 勾選：把 ID 加進陣列
      if (!this.houseForm.amenityIds.includes(id)) {
        this.houseForm.amenityIds.push(id);
      }
    } else {
      // 取消勾選：把 ID 從陣列移除
      this.houseForm.amenityIds = this.houseForm.amenityIds.filter((i: number) => i !== id);
    }
  }
}
