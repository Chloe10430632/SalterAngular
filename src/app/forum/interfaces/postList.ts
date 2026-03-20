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
  likeCount: number;
  collectCount: number;
  shareCount: number;
  commentCount: number;
  viewCount: number;
  postTags: string[];
}

