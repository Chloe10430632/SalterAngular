import { Component, NgZone } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../Services/user-service';
import { LoginResult } from '../../interfaces/ILoginResponse';
import { ILogin } from '../../interfaces/ILogin';
import { AuthService } from '../../../shared/Services/auth-service';
import { IGoogleLogin } from '../../interfaces/IGoogleLogin';



// 💡 告訴 TypeScript：google 這個變數是從外部載入的，不用擔心找不到
declare var google: any;

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) { }

  isLoading = false;

  isPasswordVisible = false;



  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  onLogin() {
    if (this.loginForm.invalid) {
      alert('請填寫正確的帳號密碼');
      return;
    }

    this.isLoading = true;
    const loginData: ILogin = this.loginForm.value as ILogin;

    this.authService.postLogin(loginData).subscribe({
      next: (res: LoginResult) => {
        this.isLoading = false;

        // 💡 使用 'in' 關鍵字來當偵探，拆開 LoginResult 包裹
        if ('token' in res) {
          // 狀況：登入成功
          this.authService.setCurrentUser(res.token);

          alert('歡迎回來！');
          this.router.navigate(['/']); // 導向首頁
        }
      },
      error: (err) => {
        this.isLoading = false;
        const res = err.error as LoginResult;

        // 💡 檢查是否為「需要驗證」的狀況 (403)
        if (res && 'status' in res && res.status === 'NeedVerification') {
          alert(res.message);
          // 這裡你可以決定是否要跳轉到註冊的 Step 3
          // 例如：this.router.navigate(['/register'], { queryParams: { step: 3, email: loginData.email } });
        } else {
          // 一般錯誤 (400 或其他)
          alert(res?.message || '登入失敗，請檢查網路連線');
        }
      }
    });
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }


}
