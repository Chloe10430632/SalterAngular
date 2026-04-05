export interface ReviewI {
  reviewId: number;
  coachId: number;
  userId: number;
  rating: number;
  reviewContent: string;
  reviewedAt: Date;
  UpdateAt: Date;
  CourseOrderId: number;
  userName?: string;
}
