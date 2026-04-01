export interface APIResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}
//================!!Interface!!================//
//================!!課程模板、上架、評論、教練卡(最新課)!!================//
export interface CourseInfoI {
  coachId: number,
  title?: string;
  description?: string;
  selectedDates: string[];
  timeSlot: string;
  maxStudents: number;
  currentStudents: number;
  updatedAt: string;
  photoUrls?: string[];
  price?: number;

}
