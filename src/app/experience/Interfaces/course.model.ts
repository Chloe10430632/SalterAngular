export interface APIResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}

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
