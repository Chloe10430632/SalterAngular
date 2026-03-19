import { Component, NgZone, OnInit } from '@angular/core';
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
export class Login implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) { }

  isLoading = false;

  isPasswordVisible = false;

  ngOnInit(): void {
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: "638169545492-dv3hddtgj85uqc2bh3opqj8dog1prjn4.apps.googleusercontent.com",
        callback: this.handleGoogleLogin.bind(this),
        auto_select: false, // 讓使用者自己選帳號
      });
    }
  }

  signInWithGoogle() {
    // 💡 直接執行，不要包在 prompt 的 callback 裡面
    const googleBtnWrapper = document.createElement('div');

    // 1. 叫 Google 在記憶體裡畫出一個按鈕
    google.accounts.id.renderButton(googleBtnWrapper, {
      theme: 'outline',
      size: 'large'
    });

    // 2. 找到這個畫出來的按鈕中的「可點擊元素」
    const googleBtn = googleBtnWrapper.querySelector('div[role=button]') as HTMLElement;

    if (googleBtn) {
      console.log('✅ 成功觸發 Google 視窗');
      googleBtn.click(); // 💡 模擬點擊，這會直接彈出選帳號視窗
    } else {
      console.log('⚠️ 自動點擊失敗，嘗試備案');
      google.accounts.id.prompt(); // 備案：如果暴力點擊失敗，才用原本的方法
    }
  }





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




  handleGoogleLogin(response: any) {
    // 1. 封裝成 IGoogleLogin 物件
    const loginData: IGoogleLogin = {
      idToken: response.credential
    };

    // 2. 呼叫 Service
    this.authService.googleLogin(loginData).subscribe({
      next: (res: LoginResult) => {
        // 💡 步驟 1 提到的型別守衛：判斷是否有 token 屬性
        if ('token' in res) {
          // ✅ 成功：儲存 Token
          this.authService.setCurrentUser(res.token);

          // 🎯 使用 NgZone 強制 Angular 回到熱區進行頁面跳轉
          this.ngZone.run(() => {
            this.router.navigate(['/']);
          });
        } else {
          // ❌ 失敗：顯示後端傳回的 message
          alert(res.message || '登入失敗');
        }
      },
      error: (err: any) => {
        console.error('API 呼叫出錯:', err);
        alert('無法連線至伺服器');
      }
    });
  }



}
