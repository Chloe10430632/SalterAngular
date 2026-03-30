export interface APIResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}

export interface CoachEditInfoI {
  coachId: number;
  coachName: string;
  avatarUrl: string;
  district: string[];
  specialities: number[];
  introduction: string;
  updateAt: string;
}
