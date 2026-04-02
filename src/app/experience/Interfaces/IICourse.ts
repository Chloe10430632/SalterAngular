import { PhotoI } from "./IIPhoto";

export interface APIResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}
//================!!Interface!!================//
//================!!課程模板、上架、評論、教練卡(最新課)!!================//
export interface CourseSessionInfoI {
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
  difficulty: string;
  location: string;
  tempId: number;
  sessionId: number;
}
export interface TempInfoI {
  coachId: number,
  title?: string;
  description?: string;
  updatedAt: string;
  photoUrls?: string[]; //存進去
  imageUrl?: PhotoI[]; //雲端抓下來
  price?: number;
  difficulty: string;
  location: string;
  tempId: number;

}
