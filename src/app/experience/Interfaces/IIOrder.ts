export interface CourseOrderI {
  // 教練相關資料
  courseSessionId?: number;
  userId?: number;
  coachId?: number;
  coachName?: string;
  avatarUrl?: string;

  // 評論相關資料
  creatReviewAt?:string;
  updateReviewAt?: string;
  reviewContent?: string;
  rating?: number;

  // 課程內容
  price?: number;
  title?: string;
  startDate?: string;
  timeSlot?: string;

  // 交易與狀態
  expTransactionId?: number;
  reservedAt?: string;
  updatedTransacAt?: string;
  status?: number;
}
