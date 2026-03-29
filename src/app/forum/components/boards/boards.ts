import { BoardInteractionsRequest } from './../../interfaces/boardInteractionsRequest';
import { Component, OnInit } from '@angular/core';
import { BoardList } from '../../interfaces/boardList';
import { BoardsService } from '../../services/boards-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrentUser } from '../../interfaces/currentUser';
import { AuthService } from '../../../core/services/auth-service';
import { BoardInteractionsService } from '../../services/board-interactions-service';

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

  /**目前使用者 */
  currentUser?: CurrentUser;

  constructor(
    private boardsService: BoardsService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private boardInteractionsService: BoardInteractionsService,) { }

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

      this.authService.currentUser$.subscribe(data => {
        this.currentUser = data;
      });

    });
  }

  handleInteraction(board: BoardList, type: string) {
    if (type === 'follow') {
      board.isFollowed = !board.isFollowed;
    }

    const request: BoardInteractionsRequest = {
      boardId: board.boardId,
      type: type as 'follow' | 'view',
    };

    if (!this.currentUser) return;
    this.boardInteractionsService.postBoardInteractionsApi(request).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.error(`interaction failed`, err);
      }
    });
  }

}
