export interface BoardInteractionsRequest {
  boardId: number;
  type: 'follow' | 'view';
}
