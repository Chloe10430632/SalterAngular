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

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length === 0) return;

    this.isLoading = true; // 開啟讀取條，因為上傳雲端需要時間

    // 1. 準備 FormData
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]); // 'files' 要對應你後端 UploadController 的參數名
    }

    // 2. 呼叫你剛寫好的 Upload API
    this.http.post<any>('https://localhost:7017/api/Upload/images', formData).subscribe({
      next: (res) => {
        // 假設後端回傳格式是 { urls: ["http...", "http..."] }
        const newUrls = res.urls.join('\n');

        // 3. 把新網址加到現有的 rawImageUrls 後面
        if (this.rawImageUrls.trim() === '') {
          this.rawImageUrls = newUrls;
        } else {
          this.rawImageUrls += '\n' + newUrls;
        }

        this.isLoading = false;
        alert(`成功上傳 ${res.urls.length} 張圖片！`);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('上傳失敗', err);
        alert('圖片上傳失敗，請檢查 API 設定');
      }
    });

    // 清空 input，讓使用者可以重複選同一個檔案
    event.target.value = '';
  }
}
