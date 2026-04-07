import { Component, NgZone, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../Services/user-service';
import { LoginResult } from '../../interfaces/ILoginResponse';
import { ILogin } from '../../interfaces/ILogin';
import { IRegister } from '../../interfaces/IRegister';
import { IVerifyRegisterOtp } from '../../interfaces/IVerifyRegisterOtp';
import { IResendOtp } from '../../interfaces/IResendOtp';
import { AuthService } from '../../../core/services/auth-service';
import { IGoogleLogin } from '../../interfaces/IGoogleLogin';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators'
import { IResetPassword } from '../../interfaces/IResetPassword';
import { IForgotPassword } from '../../interfaces/IForgotPassword';
import { NotificationService } from '../../../shared/notifyService/notification-service';
import { ChatService } from '../../Services/chat-service';
import { DragDropModule } from '@angular/cdk/drag-drop';





// 💡 告訴 TypeScript：google 這個變數是從外部載入的，不用擔心找不到
declare var google: any; //declare是用來定義外部全域變數的

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, DragDropModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private ngZone: NgZone,
    private notification: NotificationService,
    private chatService: ChatService,
    private activateRouter: ActivatedRoute
  ) { }


  // 狀態控制
  isLoginModalOpen = false;

  isRegisterModalOpen = false;

  isRegistering = false;

  isLoading = false;

  isSuccess = false;

  activeModal: 'STAY' | 'COACH' | 'TRIP' | 'FORUM' | null = null;

  isLoginPasswordVisible = false;

  isRegPasswordVisible = false;
  isRegConfirmVisible = false;

  isStoryOpen = false;
  currentSlide = 0;

  isForgotPassword = false;

  forgotStep = 1;

  hasSentEmail: boolean = false;


  //登入
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });


  //忘記密碼
  forgotForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    otp: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{6}$')]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)]),
    confirmPassword: new FormControl('', [Validators.required])
  });


  //註冊
  step = 1;

  isGoogleLoading = false;

  isGoogleSuccess = false;

  isConfirmPasswordVisible = false;

  selectedFile: File | null = null;

  previewUrl: string | null = null;

  isPictureUploaded = false;

  countdown = 180;

  resendCountdown = 60;

  timerSubscription?: Subscription;

  canResend = false;

  isResending = false;

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)]),
    confirmPassword: new FormControl('', [Validators.required]),
    userName: new FormControl('', [Validators.required]),
    phone: new FormControl(''),
    gender: new FormControl(''),
    birthday: new FormControl(''),
    profilePicture: new FormControl(''),
    otp: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{6}$')])
  });


  //錯誤訊息
  errorMessage: string | null = null;

  get f() { return this.loginForm.controls; }

  get rf() { return this.registerForm.controls; } // 註冊專用


  ngOnInit(): void {
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: "638169545492-dv3hddtgj85uqc2bh3opqj8dog1prjn4.apps.googleusercontent.com",
        callback: this.handleGoogleLogin.bind(this),
        auto_select: false, // 讓使用者自己選帳號
      });
    }

    //如果有帶Query參數，就打開登入Modal
    this.activateRouter.queryParams.subscribe(params => {
      if (params['showModal'] === 'true') {
        this.openLoginModal();
      }
    });
  }

  ngOnDestroy() {
    this.timerSubscription?.unsubscribe();
  }


  toggleRegisterMode() {
    this.isRegistering = !this.isRegistering;
    this.step = 1; // 每次切換回註冊都從第一步開始
  }


  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file; // 暫存檔案，先不傳！

      // 顯示前端預覽
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewUrl = e.target.result;
      reader.readAsDataURL(file);

      this.isPictureUploaded = true; // 這裡先假裝成功，讓「下一步」可以點
    }
  }

  nextStep() {
    // 如果根本沒選新檔案，或是圖片已經上傳過且路徑已存在，直接進第二步
    if (!this.selectedFile || (this.registerForm.get('profilePicture')?.value && this.isPictureUploaded)) {
      this.step = 2;
      return;
    }
    // 開始上傳，這時候可以把按鈕 disabled 或顯示 Loading
    this.userService.postUploadUserPictureApi(this.selectedFile).subscribe({
      next: (res) => {
        this.registerForm.patchValue({ profilePicture: res.path });
        this.isPictureUploaded = true; // 標記已實質上傳成功
        this.step = 2;
      },
      error: (err) => {
        // console.error(err);
        // alert('圖片處理失敗，請稍後再試');
        this.previewUrl = null;
        this.selectedFile = null;
        this.notification.show('圖片處理失敗，請稍後再試', 'error');

      }
    });
  }

  onRegister() {
    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      // alert('兩次密碼輸入不一致');
      this.notification.show('兩次密碼輸入不一致', 'error');
      return;
    }

    const { otp, gender, birthday, profilePicture, ...otherValues } = this.registerForm.controls;

    // 只要除了 otp 以外的欄位都 pass，就允許發送驗證碼
    const isBasicInfoValid = Object.keys(otherValues).every(key => {
      return this.registerForm.get(key)?.valid;
    });



    if (isBasicInfoValid) {

      this.isLoading = true;

      const rawData = this.registerForm.value;

      const requestData: IRegister = { ...rawData } as IRegister;

      Object.keys(requestData).forEach(key => {
        if ((requestData as any)[key] === '') {
          (requestData as any)[key] = null;
        }
      });

      delete (requestData as any).confirmPassword;

      this.userService.postRegister(requestData).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.step = 3; // 跳到第三步
          this.startTimer();
        },
        error: (err) => {
          this.isLoading = false;
          console.error('註冊失敗', err);

        }
      });
    } else {
      // alert('請檢查欄位是否填寫正確');
      this.notification.show('請檢查欄位是否填寫正確', 'error');
    }

  }

  onVerifyOtp() {
    const email = this.registerForm.get('email')?.value ?? '';
    const otp = this.registerForm.get('otp')?.value ?? '';

    if (this.registerForm.get('otp')?.invalid) {
      // alert('請輸入正確的 6 位數驗證碼');
      this.notification.show('請輸入正確的 6 位數驗證碼', 'error');
      return;
    }

    this.isLoading = true; // 1. 開始轉圈圈
    this.isSuccess = false;

    const verifyData: IVerifyRegisterOtp = { email, otp };

    this.userService.postVerifyRegisterOtp(verifyData).subscribe({
      next: (_) => {

        this.isLoading = false;
        this.isSuccess = true;
        this.notification.show('帳號註冊成功！歡迎加入 Salter', 'success');
        this.timerSubscription?.unsubscribe();

        setTimeout(() => {
          this.isRegistering = false;
          this.step = 1;
          this.loginForm.patchValue({ email: email });
          this.registerForm.reset();
          this.isSuccess = false; // 重置狀態供下次使用
        }, 1500);

      },
      error: (err) => {
        console.error('驗證失敗', err);
        // 顯示後端傳回來的錯誤訊息，例如「驗證碼過期」
        //alert(err.error?.message || '驗證失敗，請檢查驗證碼');
        this.notification.show('驗證失敗，請檢查驗證碼', 'error');
        this.isLoading = false;
        this.isSuccess = false;
        this.registerForm.patchValue({ otp: '' });
      }
    });
  }

  startTimer() {
    this.countdown = 180;
    this.canResend = false;

    // 如果之前有計時器在跑，先取消它
    this.timerSubscription?.unsubscribe();

    this.timerSubscription = interval(1000) // 每秒跳一次
      .pipe(takeWhile(() => this.countdown > 0)) // 當秒數 > 0 時繼續
      .subscribe({
        next: () => this.countdown--,
        complete: () => this.canResend = true // 時間到，允許重新發送
      });
  }

  get formatTime(): string {
    const minutes = Math.floor(this.countdown / 60);
    const seconds = this.countdown % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  get isStep2Valid(): boolean {
    const controls = this.registerForm.controls;
    // 檢查除了 otp 以外的必填項
    return (controls.email.valid &&
      controls.password.valid &&
      controls.userName.valid &&
      controls.confirmPassword.valid);
  }

  onResendOtp() {

    if (this.isResending) return;
    this.isResending = true;

    const emailValue = this.registerForm.get('email')?.value;

    if (!emailValue) {
      // alert('找不到 Email 資訊，請重新註冊');
      this.notification.show('找不到 Email 資訊，請重新註冊', 'error');
      this.step = 2;
      return;
    }

    const resendData: IResendOtp = { email: emailValue };

    this.userService.postResendOtp(resendData).subscribe({
      next: () => {
        // alert('新的驗證碼已寄送到您的信箱');
        this.notification.show('新的驗證碼已寄送到您的信箱', 'success');
        this.isResending = false;
        this.startTimer();

        this.registerForm.patchValue({ otp: '' });
      },
      error: (err) => {
        this.isResending = false;
        console.error('重發失敗', err);
        // alert(err.error?.message || '重發失敗，請稍後再試');
        this.notification.show('重發失敗，請稍後再試', 'error');
      }
    })

  }




  //登入
  onLogin() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      // this.errorMessage = '請檢查帳號密碼格式是否正確';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    const loginData: ILogin = this.loginForm.value as ILogin;

    this.authService.postLogin(loginData).subscribe({
      next: (res: LoginResult) => {
        this.isLoading = false;

        // 💡 使用 'in' 關鍵字來當偵探，拆開 LoginResult 包裹
        if ('token' in res) {
          // 狀況：登入成功
          this.authService.setCurrentUser(res.token);
          this.notification.show('登入成功', 'success');

          this.isSuccess = true;


          setTimeout(() => {
            this.isLoginModalOpen = false;
            this.router.navigate(['/']);
            this.isSuccess = false; // 重置狀態
          }, 1200);
        }
      },
      error: (err) => {
        this.isLoading = false;
        const res = err.error as LoginResult;
        const errMsg = err.error?.message || err.message || '登入失敗';
        // 💡 檢查是否為「需要驗證」的狀況 (403)
        if (res && 'status' in res && res.status === 'NeedVerification') {
          this.isRegistering = true;
          this.step = 3;
          const targetEmail = this.loginForm.value.email;
          this.registerForm.patchValue({ email: targetEmail });
          this.userService.postResendOtp({ email: targetEmail! }).subscribe({
            next: () => {
              // 通知使用者信件已發送
              this.notification.show('帳號未啟用，已自動為您發送新的驗證碼！', 'success');
              this.startTimer(); // 開始 180 秒倒數
            },
            error: (resendErr) => {
              this.notification.show('驗證碼發送失敗，請稍後點擊手動重發', 'error');
            }
          });


          // 這裡你可以決定是否要跳轉到註冊的 Step 3
          // 例如：this.router.navigate(['/register'], { queryParams: { step: 3, email: loginData.email } });
        } else {
          // 一般錯誤 (400 或其他)
          // alert(res?.message || '登入失敗，請檢查網路連線');
          this.notification.show(errMsg, 'error');
        }
      }
    });
  }

  toggleLoginPasswordVisibility() {
    this.isLoginPasswordVisible = !this.isLoginPasswordVisible;
  }

  toggleRegPassword() {
    this.isRegPasswordVisible = !this.isRegPasswordVisible;
  }

  toggleRegConfirm() {
    this.isRegConfirmVisible = !this.isRegConfirmVisible;
  }


  signInWithGoogle() {

    this.isGoogleLoading = true;

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
    setTimeout(() => {
      if (this.isGoogleLoading && !this.isGoogleSuccess) {
        this.isGoogleLoading = false;
      }
    }, 10000);
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
            this.isGoogleLoading = false;
            this.isGoogleSuccess = true;

            setTimeout(() => {
              this.isLoginModalOpen = false;
              this.router.navigate(['/']);
            }, 1500);
          });
        }
      },
      error: (err: any) => {
        this.ngZone.run(() => {
          this.isGoogleLoading = false;
        });
      }
    });
  }

  openLoginModal() {
    this.isLoginModalOpen = true;
  }


  closeLoginModal() {
    this.isLoginModalOpen = false;
    this.isForgotPassword = false; // 重置狀態
    this.isRegistering = false;    // 重置狀態
    this.step = 1;                 // 重置步驟
    this.forgotStep = 1;
  }



  openRegisterModal() {
    this.isRegisterModalOpen = true;
  }

  openActiveModal(modalType: 'STAY' | 'COACH' | 'TRIP' | 'FORUM') {
    this.activeModal = modalType;
  }

  closeRegisterModal() {
    this.isRegisterModalOpen = false;
  }

  closeActiveModal() {
    this.activeModal = null;

  }


  openStory() {
    this.isStoryOpen = true;
    this.currentSlide = 0;
  }

  closeStory() {
    this.isStoryOpen = false;
  }


  //忘記密碼
  toggleForgotPassword() {
    this.isForgotPassword = !this.isForgotPassword;
    this.isRegistering = false; // 確保關閉註冊模式
    this.forgotStep = 1;
    this.forgotForm.reset();
  }

  onSendForgotEmail() {
    if (this.forgotForm.controls.email.invalid) {
      // alert('請輸入正確的 Email');
      this.notification.show('請輸入正確的 Email', 'error');
      return;
    }

    this.isLoading = true;
    const data: IForgotPassword = { email: this.forgotForm.value.email! };

    this.userService.forgotPassword(data).subscribe({
      next: (res) => {
        // 💡 只有在 API 成功回傳後，才開始跑 1.5 秒流程
        setTimeout(() => {
          this.isLoading = false;
          this.forgotStep = 2; // ✅ 修正：跳轉到忘記密碼的第二步
          this.startTimer();   // 啟動倒數
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        // alert(err.error?.message || '發送失敗，請檢查 Email 是否正確');
        this.notification.show('發送失敗，請檢查 Email 是否正確', 'error');
      }
    });
  }

  onResetPassword() {
    if (this.forgotForm.value.newPassword !== this.forgotForm.value.confirmPassword) {
      // alert('兩次密碼輸入不一致');
      this.notification.show('兩次密碼輸入不一致', 'error');
      return;
    }

    if (this.forgotForm.invalid) {
      // alert('請填寫完整資訊');
      this.notification.show('請填寫完整資訊', 'error');
      return;
    }

    this.isLoading = true;
    const requestData: IResetPassword = {
      email: this.forgotForm.value.email!,
      otp: this.forgotForm.value.otp!,
      newPassword: this.forgotForm.value.newPassword!
    };

    this.userService.resetPassword(requestData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.isSuccess = true;

        this.notification.show('密碼修改成功！請使用新密碼登入', 'success');

        setTimeout(() => {
          // 回到登入表單狀態
          this.isForgotPassword = false;
          this.isRegistering = false;
          this.forgotStep = 1; // 重置步驟以便下次使用

          // 自動把剛才重設的 Email 填入登入表單，增加體驗
          this.loginForm.patchValue({ email: requestData.email });

          this.isSuccess = false;
          this.forgotForm.reset();
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        // alert(err.error?.message || '驗證碼錯誤或已失效');
        this.notification.show('驗證碼錯誤或已失效', 'error');
      }
    });
  }

  // 驗證忘記密碼的 OTP (Step 2 -> Step 3)
  onVerifyForgotOtp() {
    const email = this.forgotForm.get('email')?.value ?? '';
    const otp = this.forgotForm.get('otp')?.value ?? '';

    if (this.forgotForm.get('otp')?.invalid) return;

    this.isLoading = true;

    // 💡 這裡呼叫後端驗證忘記密碼 OTP 的 API
    // 如果你的後端是「最後一步才驗證」，這裡可以用 setTimeout 模擬驗證過程
    this.userService.VerifyPasswordResetOtp({ email, otp }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.forgotStep = 3; // 驗證成功，進入設定新密碼頁面
      },
      error: (err) => {
        this.isLoading = false;
        // 這裡就是你說的錯誤處理：彈出後端回傳的錯誤訊息
        // alert(err.error?.message || '驗證碼錯誤，請重新輸入');
        this.notification.show('驗證碼錯誤，請重新輸入', 'error');
        this.forgotForm.patchValue({ otp: '' });
      }
    });
  }

  // 重新發送忘記密碼的 OTP
  onResendForgotOtp() {
    if (this.isResending) return;

    const email = this.forgotForm.get('email')?.value;
    if (!email) {
      // alert('找不到 Email 資訊，請返回第一步');
      this.notification.show('找不到 Email 資訊，請返回第一步', 'error');
      this.forgotStep = 1;
      return;
    }

    this.isResending = true;
    this.userService.forgotPassword({ email }).subscribe({
      next: () => {
        // alert('新的驗證碼已寄出');
        this.notification.show('新的驗證碼已寄出', 'success');
        this.isResending = false;
        this.startTimer(); // 重新開始倒數 180 秒
        this.forgotForm.patchValue({ otp: '' }); // 清空舊的 OTP
      },
      error: (err) => {
        this.isResending = false;
        // alert(err.error?.message || '重發失敗，請稍後再試');
        this.notification.show('重發失敗，請稍後再試', 'error');
      }
    });
  }

  currentIndex: number = 0;

  private indices: { [key: string]: number } = {};

  public moveSlide(direction: number, elementId: string): void {
    const container = document.getElementById(elementId) as HTMLElement | null;
    if (!container) return;

    // 如果這個 ID 還沒被記錄過，初始化為 0
    if (this.indices[elementId] === undefined) {
      this.indices[elementId] = 0;
    }

    const items = container.querySelectorAll('.carousel-item');
    const totalItems = items.length;
    if (totalItems === 0) return;

    // 針對該 ID 計算下一個索引
    this.indices[elementId] = (this.indices[elementId] + direction + totalItems) % totalItems;

    // 計算捲動位置
    const scrollAmount = this.indices[elementId] * container.offsetWidth;

    container.scrollTo({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }

  //聊天機器人

  isChatOpen = false; // 控制視窗開關

  isLoading2 = false;

  reply: string = '';

  chatHistory: { role: 'user' | 'bot', content: string }[] = [];

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  private scrollToBottom(force: boolean = false): void {
    try {
      const element = this.chatContainer.nativeElement;
      // 判斷旅伴是否快到部了 (預留 100px 的邊距)
      const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 100;

      if (force || isAtBottom) {
        setTimeout(() => {
          element.scrollTo({
            top: element.scrollHeight,
            behavior: 'smooth' // 加個平滑捲動，更有海邊悠閒感 🌊
          });
        }, 100);
      }
    } catch (err) { }
  }

  send(message: string) {
    if (!message.trim() || this.isLoading2) return;

    this.chatHistory.push({ role: 'user', content: message });

    this.reply = '正在思考中...'; // 先給使用者心理回饋
    this.isLoading2 = true;
    this.scrollToBottom(true);

    const promptForApi = `請使用【繁體中文】回答：${message}`;

    this.chatService.sendMessage(promptForApi).subscribe({
      next: (res) => {
        console.log('收到後端回覆：', res);
        this.chatHistory.push({ role: 'bot', content: res.reply });
        this.isLoading2 = false;
        this.scrollToBottom(false);
      },
      error: (err) => {
        this.notification.show("小助手暫時無法回應", 'error');

        this.isLoading2 = false;
        this.chatHistory.push({
          role: 'bot',
          content: '🌊 哎呀！海風太強，小沙不小心被吹走了... 請再試著呼喚我一次！'
        });

        this.scrollToBottom(false);

      }
    });
  }

  //快速登入按鈕
  quickLogin(email: string, pass: string) {
    this.loginForm.patchValue({
      email: email,
      password: pass
    });

    // (選填) 如果你希望填入後直接觸發登入，可以加這行：
    this.onLogin();
  }


  //快速填基本資料按鈕
  quickRegister(name: string, email: string, pass: string) {
    this.registerForm.patchValue({
      userName: name,      // 對應你的「會員名稱」欄位
      email: email,        // 對應你的「電子信箱」欄位
      password: pass,      // 對應你的「密碼」欄位
      confirmPassword: pass // 對應你的「重新輸入密碼」欄位
    });

    // (選填) 如果你有手機號碼等其他必填項，也可以順便補齊
    // this.registerForm.get('phone')?.setValue('0912345678');
  }



}
