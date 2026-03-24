export interface PostList {
  postId: number;
  userName: string;
  avatarUrl: string;
  boardId: number;
  boardTitle: string;
  locationTitle: string;
  contentPreview: string;
  imageUrls: string[];
  createdAt: string;
  isLiked: boolean;
  likeCount: number;
  isCollected: boolean;
  collectCount: number;
  shareCount: number;
  commentCount: number;
  viewCount: number;
  postTags: string[];
}

