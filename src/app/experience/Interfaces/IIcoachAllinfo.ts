export interface APIResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}

export interface CoachAllInfoI {
  coachId: number;
  coachName: string;
  avatarUrl: string;
  district: string;
  city: string;
  avgRating: number;
  reviewCount: number;
  specialities: string[];
  introduction: string;
  districtId: number;
  cityId: number;
}


