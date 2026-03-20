export interface PostInteractionsRequest {
  postId: number;
  type: 'like' | 'collect' | 'share' | 'report' | 'view';
  reportReason?: string; // 只有在 type 是 'report' 時才需要
}
