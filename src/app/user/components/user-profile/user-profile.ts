import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../Services/user-service';
import { AuthService } from '../../../core/services/auth-service';
import { NotificationService } from '../../../shared/notifyService/notification-service';
import { CurrentUser } from '../../../forum/interfaces/currentUser';
import { IUserEditRequest } from '../../interfaces/IUserEditRequest';

@Component({
  selector: 'app-user-profile',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit {

  profileForm = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    phone: new FormControl(''),
    gender: new FormControl(''),
    birthday: new FormControl(''),
    profilePicture: new FormControl('')
  });

  isLoading = false;
  previewUrl: string | null = null;
  currentUser?: CurrentUser;
  selectedFile: File | null = null;
  isPictureUploaded = false;
  isEditing = false;
  fullUserData: any;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.loadFullUserData();
      }
    });
  }

  loadFullUserData() {
    // 🚀 因為有攔截器，API 網址不用帶 ID！
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        // data 是後端從 Token 識別身分後回傳的詳細資料
        this.fullUserData = data;
        this.profileForm.patchValue(data);
        this.previewUrl = null;
      },
      error: (err) => this.notification.show('無法載入最新資料', 'error')
    });
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

  onSave() {
    // 1. 基本檢查
    if (this.profileForm.invalid || this.isLoading) {
      this.notification.show('請檢查表單欄位', 'error');
      return;
    }

    this.isLoading = true;

    /**
     * 🎯 內部方法：執行最終的 [PUT] 資料更新
     * 這個方法會送出 JSON 物件，符合你後端的 UserEditViewModel
     */
    const executeFinalPut = (newPhotoPath?: string) => {
      // 組合資料 (對齊後端 UserEditViewModel)
      const updateRequest: IUserEditRequest = {
        id: this.currentUser?.id ?? 0,

        // 🎯 必填欄位：保證給字串，就算空也是空字串
        userName: this.profileForm.get('userName')?.value ?? '',

        // 🎯 選填欄位：使用 value || undefined
        // 這樣如果欄位是空的、或是 null，都會變成 undefined，符合 interface 的 "?" 定義
        phone: this.profileForm.get('phone')?.value || undefined,
        gender: this.profileForm.get('gender')?.value || undefined,
        birthday: this.profileForm.get('birthday')?.value || undefined,

        profilePicture: newPhotoPath || this.profileForm.get('profilePicture')?.value || undefined
      };

      // 呼叫你的 UserService.putUpdateUserProfile(updateRequest)
      this.userService.putUpdateUserProfile(updateRequest).subscribe({
        next: (res) => {
          this.isLoading = false;

          // 🎯 處理 Token：你後端有回傳 GenerateJwtToken，所以這裡要更新
          if (res && res.token) {
            this.authService.setCurrentUser(res.token);
          }
          this.notification.show('個人資料修改成功！', 'success');

          // 重置狀態
          this.isEditing = false; // 跳回檢視模式
          this.selectedFile = null;
          this.previewUrl = null;
          this.isPictureUploaded = false;
        },
        error: (err) => {
          this.isLoading = false;
          console.error('更新失敗', err);
          this.notification.show(err.error?.message || '更新失敗', 'error');
        }
      });
    };

    // 🚀 啟動流程判斷
    if (this.selectedFile) {
      // 情況 1：有選新圖片 -> 先呼叫你原本那隻「處理圖片」的 API
      this.userService.postUploadUserPictureApi(this.selectedFile).subscribe({
        next: (res) => {
          // 上傳成功，拿回 res.path，接著跑最後的 PUT
          executeFinalPut(res.path);
        },
        error: (err) => {
          this.isLoading = false;
          this.notification.show('圖片上傳失敗，請稍後再試', 'error');
        }
      });
    } else {
      // 情況 2：沒換圖 -> 直接跑最後的 PUT
      executeFinalPut();
    }
  }

  // 真正去跑 [PUT] 的地方
  private finalUpdate() {
    const updateData: IUserEditRequest = {
      ...this.profileForm.getRawValue(),
      id: this.currentUser?.id ?? 0,
      // 這裡確保抓到的是最新的路徑 (不論是剛傳好的還是原本舊的)
      profilePicture: this.profileForm.get('profilePicture')?.value ?? ""
    } as IUserEditRequest;

    this.userService.putUpdateUserProfile(updateData).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.token) {
          this.authService.setCurrentUser(res.token); // 📢 全站同步換臉
        }
        this.previewUrl = null;      // 🛑 清空 Base64 預覽，讓 img src 可以抓到 currentUser
        this.selectedFile = null;
        this.notification.show('更新成功', 'success');
        this.selectedFile = null;
        this.isPictureUploaded = false; // 重設狀態，下次改圖還要再傳一次
      },
      error: (err) => {
        this.isLoading = false;
        this.notification.show('更新失敗', 'error');
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // 如果是從編輯取消，重新載入一次資料確保顯示正確
      this.loadFullUserData();
      this.previewUrl = null;
      this.selectedFile = null;
    }
  }




}
