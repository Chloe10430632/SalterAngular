export interface PostList {
  postId: number;
  userName: string;
  avatarUrl: string;
  boardTitle: string;
  contentPreview: string;
  imageUrls: string[];
  createdAt: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  postTags: string[];
}

