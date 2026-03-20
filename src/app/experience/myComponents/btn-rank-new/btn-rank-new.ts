import { Component, EventEmitter, Output } from '@angular/core';
import { rankItem, SRank } from '../../Service/SRank';

@Component({
  selector: 'app-btn-rank-new',
  imports: [],
  templateUrl: './btn-rank-new.html',
  styleUrl: './btn-rank-new.css',
})
export class BtnRankNew {
  @Output() rankUpdated = new EventEmitter<rankItem[]>();

  constructor(private rankServ: SRank) { }
  newest() {
    this.rankServ.getNewRank().subscribe({
      next: (data: rankItem[]) => {
        this.rankUpdated.emit(data);
        console.log("最新排名:", data);
      },
      error: (err: any) => {
        console.error('抓取失敗：', err);
      }
    });
  }

}
