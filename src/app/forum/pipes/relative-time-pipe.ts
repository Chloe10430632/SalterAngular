import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime',
  standalone: true
})
export class RelativeTimePipe implements PipeTransform {

  transform(value: string | number | Date): string {
    if (!value) return '';
    const now = Date.now();
    // const now = new Date('2026-02-13'); //基準日設定為2026-02-12
    const past = new Date(value);
    const diffInSeconds = Math.floor((now - past.getTime()) / 1000);

    // 處理未來時間或極短秒數
    if (diffInSeconds < 60) {
      return '剛剛';
    }

    // 1. 幾分鐘前
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} 分鐘前`;
    }

    // 2. 幾小時前
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} 小時前`;
    }

    // 3. 幾天前 (7天內)
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} 天前`;
    }

    // 超過一週，回傳簡潔的日期格式
    return past.toLocaleDateString('zh-TW', { year: 'numeric', month: 'short', day: 'numeric' });
  }

}
