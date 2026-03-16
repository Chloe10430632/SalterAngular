import { UserService } from './../../Services/user-service';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { IRegister } from '../../interfaces/IRegister';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  constructor(private UserService: UserService) { }

  step: number = 1;

  previewUrl: string | null = null;
  isPictureUploaded: boolean = false;

  registerForm = new FormGroup({

    email: new FormControl('', [Validators.required, Validators.email]),

    password: new FormControl('', [Validators.required, Validators.minLength(6)]),

    //確認密碼
    confirmPassword: new FormControl('', [Validators.required]),

    userName: new FormControl('', [Validators.required]),

    phone: new FormControl(''),

    gender: new FormControl(''),

    birthday: new FormControl(''),

    profilePicture: new FormControl('')
  });

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      // 1. 前端預覽邏輯 (這部分維持原樣，讓使用者覺得很快)
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewUrl = e.target.result;
      reader.readAsDataURL(file);

      // 2. 正式呼叫 API 上傳
      // 注意：這裡直接呼叫你剛才在 AuthService 寫好的 uploadUserPicture
      this.UserService.postUploadUserPictureApi(file).subscribe({
        next: (res) => {
          console.log('圖片上傳成功，後端路徑為:', res.path);

          // 3. 把後端路徑存入表單的 profilePicture 欄位
          this.registerForm.patchValue({
            profilePicture: res.path
          });

          // 4. 上傳成功，解鎖「下一步」按鈕
          this.isPictureUploaded = true;
        },
        error: (err) => {
          console.error('圖片上傳失敗', err);
          alert('圖片上傳失敗，請檢查網路或檔案格式');
          this.isPictureUploaded = false;
        }
      });
    }
  }

  // 5. 第二階段：正式送出註冊
  onRegister() {
    if (this.registerForm.valid) {

      const requestData: IRegister = this.registerForm.value as IRegister;

      this.UserService.postRegister(requestData).subscribe({
        next: (res) => {
          console.log('註冊成功！', res.message);
          alert('註冊成功，請登入');
        },
        error: (err) => {
          console.error('註冊失敗', err);
          alert(err.error?.message || '註冊發生錯誤');
        }
      });
    } else {
      alert('請檢查欄位是否填寫正確');
    }

  }
}


