export interface IResetPassword {
  email: string;       // 對應後端的 Email
  otp: string;         // 對應後端的 Otp
  newPassword: string;  // 對應後端的 NewPassword
  // 注意：前端通常會多一個 confirmPassword 用來做 UI 驗證，但「送給後端」時不需要它
}
