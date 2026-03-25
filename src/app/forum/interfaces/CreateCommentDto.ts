export interface CreateCommentDto {
  postId: number;
  parentCommentId: number | null;
  content: string;
}
