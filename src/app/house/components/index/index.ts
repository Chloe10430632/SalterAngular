import { CommonModule, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-index',
  imports: [CommonModule, DecimalPipe],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index {
  // 模擬從後端 API 抓回來的房屋資料
  properties = [
    { id: 1, name: '極簡風山景小屋', location: '南投縣', price: 4200, rating: 4.9, img: 'https://picsum.photos/id/1016/400/400' },
    { id: 2, name: '日式禪風公寓', location: '台北市', price: 3500, rating: 4.8, img: 'https://picsum.photos/id/1018/400/400' },
    { id: 3, name: '海邊第一排別墅', location: '屏東縣', price: 6800, rating: 4.95, img: 'https://picsum.photos/id/1015/400/400' },
    { id: 4, name: '工業風設計旅店', location: '台中市', price: 2900, rating: 4.7, img: 'https://picsum.photos/id/1040/400/400' },
    // 你可以多複製幾組，畫面會比較豐滿
  ];

  openCalendar(event: any) {
    console.log('點擊成功');

    event.stopPropagation();
    // 加上 event: Event 並調用 stopPropagation()
    // 可以防止點擊時間的時候，地點建議的下拉選單也跑出來攪局
    const modal = document.getElementById('calendar_modal') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }
}
