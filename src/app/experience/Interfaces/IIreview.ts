import { CoachAllInfoI } from "./IIcoachAllinfo";
import { CourseSessionInfoI } from "./IICourse";

export interface ReviewI {
  reviewId: number;
  userId: number;
  rating: number;
  reviewContent: string;
  reviewedAt: Date;
  UpdateAt: Date;
  CourseOrderId: number;
  userName?: string;
  coachInfo?: CoachAllInfoI;
  courseInfo?: CourseSessionInfoI;
}
