export interface ReviewI {
  reviewId: number;
  coachId: number;
  userId: number;
  rating: number;
  ReviewContent: string;
  ReviewedAt: Date;
  UpdateAt: Date;
  CourseOrderId: number;
}
