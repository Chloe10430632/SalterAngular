export interface ICreateReview {
  roomTypeId: number;
  rating: number;
  comment: string;
  memberId: number;
  bookingId: number;
}

export interface IUpdateReview {
  reviewId: number;
  rating: number;
  comment: string;
  memberId: number;
}
