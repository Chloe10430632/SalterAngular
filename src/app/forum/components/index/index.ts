import { AdsService } from './../../services/ads-service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterOutlet, RouterLinkWithHref, RouterLinkActive } from '@angular/router';
import { BoardList } from '../../interfaces/boardList';
import { BoardsService } from '../../services/boards-service';
import { AdData } from '../../interfaces/adData';

@Component({
  selector: 'app-index',
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive],
  templateUrl: './index.html',
  styleUrl: './index.css',
  encapsulation: ViewEncapsulation.None,
})
export class Index implements OnInit {

  /**Top5熱門看板列表 */
  boardListPop5: BoardList[] = [];

  /**Top5追蹤推薦看板列表 */
  boardListFollow5: BoardList[] = [];

  /**廣告資料 */
  adDetails?: AdData;

  constructor(private boardsService: BoardsService, private adsService: AdsService) {

  }

  ngOnInit(): void {
    this.boardsService.GetTop5PopBoardsApi().subscribe(data => {
      this.boardListPop5 = data;
    });

    this.boardsService.GetTop5FollowBoardsApi().subscribe(data => {
      this.boardListFollow5 = data;
    });

    this.adsService.GetAdsApi().subscribe(data => {
      this.adDetails = data;
    });


  }




}
