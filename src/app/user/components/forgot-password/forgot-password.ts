import { Component } from '@angular/core';
import { UserService } from '../../Services/user-service';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IForgotPassword } from '../../interfaces/IForgotPassword';
import { interval, Subscription, takeWhile } from 'rxjs';
import { IResetPassword } from '../../interfaces/IResetPassword';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {

  userEmail: string = ''; // 綁定 HTML

  constructor(private userService: UserService, private router: Router) {

  }

  step: number = 1;
  isLoading: boolean = false;
  countdown: number = 300;
  timerSubscription?: Subscription;
  canResend: boolean = false;
  isPasswordVisible = false;

  forgotForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    otp: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{6}$')]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  onSendEmail() {
    if (this.forgotForm.controls.email.invalid) {
      alert('請輸入正確的 Email');
      return;
    }

    this.isLoading = true;
    const data: IForgotPassword = { email: this.forgotForm.value.email! };

    this.userService.forgotPassword(data).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.step = 2; // 跳到下一步
        this.startTimer();
      },
      error: (err) => {
        this.isLoading = false;
        alert(err.error?.message || '發送失敗，請檢查 Email 是否正確');
      }
    });
  }

  onResetPassword() {
    if (this.forgotForm.value.newPassword !== this.forgotForm.value.confirmPassword) {
      alert('兩次密碼輸入不一致');
      return;
    }

    if (this.forgotForm.invalid) {
      alert('請填寫完整資訊');
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
        alert('密碼重設成功！請重新登入');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        alert(err.error?.message || '驗證碼錯誤或已失效');
      }
    });
  }

  startTimer() {
    this.countdown = 300;
    this.canResend = false;
    this.timerSubscription?.unsubscribe();
    this.timerSubscription = interval(1000)
      .pipe(takeWhile(() => this.countdown > 0))
      .subscribe({
        next: () => this.countdown--,
        complete: () => this.canResend = true
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

}
