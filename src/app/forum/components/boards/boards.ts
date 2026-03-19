import { Component, OnInit } from '@angular/core';
import { BoardList } from '../../interfaces/boardList';
import { BoardsService } from '../../services/boards-service';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-boards',
  imports: [RouterLink],
  templateUrl: './boards.html',
  styleUrl: './boards.css',
})
export class Boards implements OnInit {
  /**全部看板列表 */
  boardList: BoardList[] = [];

  /**看板篩選條件 */
  queryPara: string = "";


  constructor(private boardsService: BoardsService, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe((params) => {
      this.queryPara = this.activatedRoute.snapshot.queryParams['sortBy'];
      if (!this.queryPara) {
        this.boardsService.GetAllBoardsApi().subscribe(data => {
          this.boardList = data;
        });
      }

      if (this.queryPara === 'popular') {
        this.boardsService.GetPopBoardsApi().subscribe(data => {
          this.boardList = data;
        });
      }

      if (this.queryPara === 'follow') {
        this.boardsService.GetFollowBoardsApi().subscribe(data => {
          this.boardList = data;
        });
      }



    });





  }








}
