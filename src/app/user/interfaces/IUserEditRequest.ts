export interface IUserEditRequest {
  id: number;
  userName: string;
  phone?: string;     // ? 代表允許為空 (null 或 undefined)
  gender?: string;
  birthday?: string;  // DateOnly 在前端通常用字串處理 (yyyy-mm-dd)
  profilePicture?: string;
}
