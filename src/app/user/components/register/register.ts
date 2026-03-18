import { UserService } from './../../Services/user-service';
import { Component, NgModule } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, NgModel, FormsModule } from '@angular/forms';
import { IRegister } from '../../interfaces/IRegister';
import { Router } from '@angular/router';
import { IVerifyRegisterOtp } from '../../interfaces/IVerifyRegisterOtp';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { IResendOtp } from '../../interfaces/IResendOtp';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {



  constructor(private UserService: UserService,
    private router: Router
  ) { }

  countdown: number = 300; // 倒數5 分鐘 = 300 秒

  timerSubscription?: Subscription;

  canResend: boolean = false; // 是否顯示「重新發送」按鈕


  step: number = 1;

  isResending: boolean = false;

  selectedFile: File | null = null;

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

    profilePicture: new FormControl(''),

    otp: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{6}$')])
  });

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
    this.UserService.postUploadUserPictureApi(this.selectedFile).subscribe({
      next: (res) => {
        this.registerForm.patchValue({ profilePicture: res.path });
        this.isPictureUploaded = true; // 標記已實質上傳成功
        this.step = 2;
      },
      error: (err) => {
        console.error(err);
        alert('圖片處理失敗，請稍後再試');
      }
    });
  }


  // 5. 第二階段：正式送出註冊
  onRegister() {
    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      alert('兩次密碼輸入不一致');
      return;
    }

    const { otp, ...otherValues } = this.registerForm.controls;

    // 只要除了 otp 以外的欄位都 pass，就允許發送驗證碼
    const isBasicInfoValid = Object.keys(otherValues).every(key => {
      return this.registerForm.get(key)?.valid;
    });



    if (isBasicInfoValid) {

      const requestData: IRegister = this.registerForm.value as IRegister;

      this.UserService.postRegister(requestData).subscribe({
        next: (res) => {
          alert('驗證碼已寄出，請檢查您的信箱');
          this.step = 3; // 跳到第三步
          this.startTimer();
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

  onVerifyOtp() {
    const email = this.registerForm.get('email')?.value ?? '';
    const otp = this.registerForm.get('otp')?.value ?? '';

    if (this.registerForm.get('otp')?.invalid) {
      alert('請輸入正確的 6 位數驗證碼');
      return;
    }

    const verifyData: IVerifyRegisterOtp = { email, otp };

    this.UserService.postVerifyRegisterOtp(verifyData).subscribe({
      next: (_) => {
        alert('驗證成功！帳號已啟用，請重新登入');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('驗證失敗', err);
        // 顯示後端傳回來的錯誤訊息，例如「驗證碼過期」
        alert(err.error?.message || '驗證失敗，請檢查驗證碼');
      }
    });
  }

  startTimer() {
    this.countdown = 15;
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

  ngOnDestroy() {
    this.timerSubscription?.unsubscribe();
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
      alert('找不到 Email 資訊，請重新註冊');
      this.step = 2;
      return;
    }

    const resendData: IResendOtp = { email: emailValue };

    this.UserService.postResendOtp(resendData).subscribe({
      next: () => {
        alert('新的驗證碼已寄送到您的信箱');
        this.isResending = false;
        this.startTimer();

        this.registerForm.patchValue({ otp: '' });
      },
      error: (err) => {
        this.isResending = false;
        console.error('重發失敗', err);
        alert(err.error?.message || '重發失敗，請稍後再試');
      }
    })

  }




}


