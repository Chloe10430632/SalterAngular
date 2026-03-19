import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-house',
  imports: [FormsModule],
  templateUrl: './create-house.html',
  styleUrl: './create-house.css',
})

export class CreateHouse implements OnInit {

  // 初始化為 false (預設不轉圈圈)
  isLoading = false;
  // 存後端的設備ID
  amenityList: any[] = [];

  // 對應後端 HouseCreateDTO 的結構
  houseForm = {
    userID: 1, // 暫時寫死，之後可以從 Login 取
    houseDescription: '',
    location: '',
    district: '',
    citie: '',
    roomName: '',
    capacity: 2,
    pricePerNight: 0,
    roomDescription: '',
    imageUrls: [] as string[],
    amenityIds: [] as number[]
  };

  rawImageUrls: string = ''; //存放textarea 貼進來的網址長字串

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any[]>('https://localhost:7017/api/Home/amenities').subscribe(data => {
      this.amenityList = data;
    })
  }
  // 處理 Checkbox 勾選
  onAmenityToggle(id: number, event: any) {
    if (event.target.checked) {
      this.houseForm.amenityIds.push(id);
    } else {
      this.houseForm.amenityIds = this.houseForm.amenityIds.filter(aid => aid !== id);
    }
  }

  onSubmit() {
    // 處理圖片網址：按行切割
    this.houseForm.imageUrls = this.rawImageUrls.split('\n').filter(u => u.trim() !== '');

    // 呼叫你剛寫好的 API
    this.http.post('https://localhost:7017/api/Home/create-full-house', this.houseForm)
      .subscribe({
        next: (res) => {
          alert('房源新增成功！');
          // 這裡可以導向列表頁
        },
        error: (err) => alert('新增失敗：' + err.error.message)
      });
  }
}
