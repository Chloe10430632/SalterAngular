import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class Detail implements OnInit {

  selectedProperty: any = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const idFromUrl = this.route.snapshot.paramMap.get('id');
    const id = Number(idFromUrl);

    // 4. 這一區塊就是未來要換成 API 的地方
    // 目前我們先用這組假資料模擬資料庫
    const mockData = [
      { id: 1, name: '極簡風山景小屋', location: '南投縣', price: 4200, rating: 4.9, img: 'https://picsum.photos/id/1016/800/600', host: '阿明', desc: '這是一間充滿森林氣息的小屋...' },
      { id: 2, name: '日式禪風公寓', location: '台北市', price: 3500, rating: 4.8, img: 'https://picsum.photos/id/1018/800/600', host: '小雅', desc: '體驗最純正的榻榻米生活...' },
      { id: 3, name: '海邊第一排別墅', location: '屏東縣', price: 6800, rating: 4.95, img: 'https://picsum.photos/id/1015/800/600', host: '波比', desc: '開窗就是海，走路 30 秒到沙灘...' }
    ];

    // 5. 根據 ID 找到對應的資料
    this.selectedProperty = mockData.find(item => item.id === id);

    // 6. 偵錯用：看看有沒有抓到
    console.log('當前房屋資料：', this.selectedProperty);

  }

  getAverageRating(): string {
    if (!this.selectedProperty?.Reviews || this.selectedProperty.Reviews.length === 0) {
      return '新房源';
    }
    const sum = this.selectedProperty.Reviews.reduce((acc: number, cur: any) => acc + cur.Rating, 0);
    return (sum / this.selectedProperty.Reviews.length).toFixed(1);
  }


}
