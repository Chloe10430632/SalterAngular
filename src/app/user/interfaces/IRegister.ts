//寄給後端
export interface IRegister {
  email: string;
  password: string;
  userName: string;
  phone?: string;
  gender?: string;
  birthday?: string;
  profilePicture?: string;
}

//後端寄回來
export interface IRegisterResponse {
  message: string;
}

