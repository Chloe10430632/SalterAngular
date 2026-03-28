export interface ApiResponse {
  isSuccess: boolean;
  message: string;
  data: SessionInfoI;
}


export interface SessionInfoI {
  coachId?: number;
  selectedDates?: string[];
  timeSlot?: string;
  maxStudents?: number;
  currentStudents?: number;
  updatedAt?: string;
}
