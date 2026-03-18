// 基礎版：只有訊息
export interface IBaseResponse {
  message: string;
}

// 進階版：繼承訊息，再增加 Token
export interface ILoginResponse extends IBaseResponse {
  token: string;
}
