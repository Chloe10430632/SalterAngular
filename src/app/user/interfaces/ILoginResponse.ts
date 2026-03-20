import { IBaseResponse } from "./IBaseResponse";


// 1. 成功時：有 message 和 token
export interface ILoginSuccess extends IBaseResponse {
  token: string;
}

// 2. 需驗證時：有 message 和 status
export interface ILoginNeedVerify extends IBaseResponse {
  status: 'NeedVerification';
}

// 3. 失敗時：直接複用 IBaseResponse (只有 message)
// 或者如果你想分更細，也可以寫 export interface ILoginError extends IBaseResponse {}

// 🔥 最終匯出這個「聯集」
export type LoginResult = ILoginSuccess | ILoginNeedVerify | IBaseResponse;
