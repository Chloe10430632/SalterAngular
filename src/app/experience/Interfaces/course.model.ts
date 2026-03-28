export interface APIResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}

export interface CourseInfo {
  coachId: number,
  selectedDates: string[];
  timeSlot: string;
  maxStudents: number;
  currentStudents: number;
  updatedAt: string;
  photoUrls?: string[];
  title?: string;
  description?: string;
  price?: number;

}
