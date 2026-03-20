import { Component } from '@angular/core';
import { SRank, rankItem } from '../../Service/SRank';

@Component({
  selector: 'app-btn-rank-pop',
  standalone: true,
  imports: [],
  templateUrl: './btn-rank-pop.html',
  styleUrl: './btn-rank-pop.css',
})
export class BtnRankPop {
  rankList: rankItem[] = [];

  constructor(private rankServ: SRank) { }

  popular() {
    this.rankServ.getPopRank().subscribe({
      next: (data: rankItem[]) => { // 補上型別避免 any 報錯
        this.rankList = data;
        console.log('抓到資料囉：', this.rankList);
      },
      error: (err: any) => { // 補上型別避免 any 報錯
        console.error('抓取失敗：', err);
      }
    });
  }
}
