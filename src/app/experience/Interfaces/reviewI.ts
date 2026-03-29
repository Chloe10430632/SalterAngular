export interface ReviewI {
  reviewId: number;
  coachId: number;
  userName: string; // 評論者的名字
  rating: number; // 評分，假設是1-5的整數
  ReviewContent: string; // 評論內容
  ReviewedAt: Date; // 評論日期
  CourseOrderId: number; // 這個評論是針對哪一筆課程訂單的
}
