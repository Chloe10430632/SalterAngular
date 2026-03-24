export interface PostDetailsData {
  postId: number;
  userName: string;
  avatarUrl: string;
  boardId: number;
  boardTitle: string;
  locationTitle: string;
  contentPreview: string;
  fullContent: string;
  imageUrls: string[];
  postTags: string[]; // 雖然目前是空陣列，但定義為 string[] 以供未來使用
  createdAt: string;  // ISO 8601 格式
  isLiked: boolean;
  likeCount: number;
  isCollected: boolean;
  collectCount: number;
  shareCount: number;
  commentCount: number;
  viewCount: number;
  comments: PostComment[];
}

/**留言與回覆介面*/
export interface PostComment {
  commentId: number;
  userName: string;
  content: string;
  avatarUrl: string | null; // 處理如 t0m.____ 的 null 情況
  createdAt: string;
  replies: PostCommentReply[];    // 串接回覆陣列
}

/**第二層回覆介面 (雖然目前結構與 PostComment 相似，但分開定義利於未來擴充)*/
export interface PostCommentReply {
  commentId: number;
  userName: string;
  content: string;
  avatarUrl: string | null;
  createdAt: string;
  replies: any[]; // 第三層固定為空陣列
}
