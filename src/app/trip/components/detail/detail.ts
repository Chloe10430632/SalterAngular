import { Component, OnInit, AfterViewInit, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgClass } from '@angular/common';
import { TripService } from '../../services/trip';
import { TripAnnouncement, TripDetail, TripGearItem } from '../../interfaces/trip';
import { NotificationService } from '../../../shared/notifyService/notification-service';
import { AuthService } from '../../../core/services/auth-service';
import { AvatarPipe } from '../../../shared/pipes/avatar-pipe';
import { TripStateService } from '../../services/trip-state';

@Component({
  selector: 'app-detail',
  imports: [FormsModule, DatePipe, NgClass, RouterLink, AvatarPipe],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Detail implements OnInit, AfterViewInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tripService = inject(TripService);
  private notify = inject(NotificationService);
  private authService = inject(AuthService);
  private tripState = inject(TripStateService);

  tripId = 0;
  trip: TripDetail | null = null;
  isLoading = true;
  activeTab = 'intro';

  currentUserId = 0;
  currentUserPicture = '';
  currentUserName = '';

  isMember = false;
  isOrganizer = false;
  isFavorite = false;
  isJoining = false;
  isLeaving = false;
  showExitModal = false;

  showEditModal = false;
  showDeleteModal = false;
  isUpdating = false;
  isDeleting = false;

  isDragging = false;
  isUploading = false;
  coverPreview = '';

  gearItems: TripGearItem[] = [];
  showGearForm = false;
  editingGearId: number | null = null;
  gearFormData = { itemName: '', isRequired: false };

  announcements: TripAnnouncement[] = [];
  showAnnouncementForm = false;
  editingAnnouncementId: number | null = null;
  announcementFormData = { title: '', content: '' };

  showStartPicker = false;
  showEndPicker = false;
  today = new Date().toISOString().split('T')[0];

  // inline 刪除確認
  confirmingDeleteGearId: number | null = null;
  confirmingDeleteAnnouncementId: number | null = null;

  get myCheckedCount(): number {
    return this.gearItems.filter(g => g.isCheckedByMe).length;
  }

  get memberProgress(): number {
    if (!this.trip) return 0;
    return Math.round((this.trip.memberCount / this.trip.capacity) * 100);
  }

  get remainingSlots(): number {
    if (!this.trip) return 0;
    return this.trip.capacity - this.trip.memberCount;
  }

  get currentUrl(): string {
    return window.location.href;
  }

  get daysUntilTrip(): number | null {
    if (!this.trip) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(this.trip.startAt);
    start.setHours(0, 0, 0, 0);
    const diff = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUserId = user?.id ?? 0;
      this.currentUserPicture = user?.picture ?? '';
      this.currentUserName = user?.name ?? '';
      if (this.trip) this.checkMembership();
    });

    this.route.params.subscribe(params => {
      this.tripId = +params['id'];
      this.loadTrip();
    });
  }

  ngAfterViewInit() {
    import('cally');
  }

  loadTrip() {
    this.isLoading = true;
    this.tripService.getTripById(this.tripId).subscribe({
      next: (res) => {
        if (res.success) {
          this.trip = res.data;
          this.isFavorite = this.trip.isFavorite ?? false;
          this.checkMembership();
          if (this.isMember) {
            this.loadGearItems();
            this.loadAnnouncements();
          }
        }
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  checkMembership() {
    if (!this.trip) return;
    this.isOrganizer = this.trip.organizerUserId === this.currentUserId;
    this.isMember = this.isOrganizer || this.trip.members.some(m => m.userId === this.currentUserId);
    this.tripState.isMember.set(this.isMember);
  }

  joinTrip() {
    if (!this.currentUserId) {
      this.notify.show('請先登入才能加入行程', 'error');
      return;
    }
    this.isJoining = true;
    this.tripService.joinTrip(this.tripId).subscribe({
      next: () => {
        this.notify.show('成功加入行程！', 'success');
        this.loadTrip();
        this.isJoining = false;
      },
      error: () => this.isJoining = false
    });
  }

  leaveTrip() {
    this.isLeaving = true;
    this.tripService.leaveTrip(this.tripId).subscribe({
      next: () => {
        this.notify.show('已退出行程', 'success');
        this.showExitModal = false;
        this.loadTrip();
        this.isLeaving = false;
      },
      error: () => this.isLeaving = false
    });
  }

  toggleFavorite() {
    if (!this.currentUserId) {
      this.notify.show('請先登入才能收藏', 'error');
      return;
    }
    if (this.isFavorite) {
      this.tripService.removeFavorite(this.tripId).subscribe({
        next: () => { this.isFavorite = false; }
      });
    } else {
      this.tripService.addFavorite(this.tripId).subscribe({
        next: () => { this.isFavorite = true; }
      });
    }
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      active: '揪團中', locked: '即將成行', completed: '已結束', cancelled: '已取消'
    };
    return map[status] ?? status;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      active: 'badge-success', locked: 'badge-warning',
      completed: 'badge-ghost', cancelled: 'badge-error'
    };
    return map[status] ?? 'badge-ghost';
  }

  getTripTypeLabel(type: string): string {
    const map: Record<string, string> = {
      surf: '🏄 衝浪', dive: '⚓ 深潛', snorkel: '🤿 浮潛',
      kayak: '🚣 獨木舟', sailing: '⛵ 帆船', sup: '🏄 SUP 立槳', other: '🌊 其他'
    };
    return map[type] ?? type;
  }

  getInitial(name: string): string {
    return name?.charAt(0)?.toUpperCase() ?? '?';
  }

  isTab(tab: string): boolean {
    return this.activeTab === tab;
  }

  // 裝備清單

  loadGearItems() {
    this.tripService.getGearItems(this.tripId).subscribe({
      next: (res) => {
        if (res.success) {
          this.gearItems = res.data.sort((a, b) => {
            if (a.isRequired === b.isRequired) return 0;
            return a.isRequired ? -1 : 1;
          });
        }
      }
    });
  }

  openAddGearForm() {
    this.editingGearId = null;
    this.gearFormData = { itemName: '', isRequired: false };
    this.showGearForm = true;
  }

  openEditGearForm(gear: TripGearItem) {
    this.editingGearId = gear.id;
    this.gearFormData = { itemName: gear.itemName, isRequired: gear.isRequired };
    this.showGearForm = true;
  }

  closeGearForm() {
    this.showGearForm = false;
    this.editingGearId = null;
    this.gearFormData = { itemName: '', isRequired: false };
  }

  saveGearItem() {
    if (!this.gearFormData.itemName) return;
    if (this.editingGearId) {
      this.tripService.updateGearItem(this.editingGearId, this.gearFormData).subscribe({
        next: () => { this.loadGearItems(); this.closeGearForm(); }
      });
    } else {
      this.tripService.createGearItem(this.tripId, this.gearFormData).subscribe({
        next: () => { this.loadGearItems(); this.closeGearForm(); }
      });
    }
  }

  deleteGearItem(gearId: number) {
    this.tripService.deleteGearItem(gearId).subscribe({
      next: () => {
        this.loadGearItems();
        this.confirmingDeleteGearId = null;
      }
    });
  }

  toggleGearCheck(gear: TripGearItem) {
    this.tripService.toggleGearCheck(gear.id).subscribe({
      next: () => {
        gear.isCheckedByMe = !gear.isCheckedByMe;
        gear.checkedCount += gear.isCheckedByMe ? 1 : -1;
      }
    });
  }

  // 公告

  loadAnnouncements() {
    this.tripService.getAnnouncements(this.tripId).subscribe({
      next: (res) => {
        if (res.success) this.announcements = res.data;
      }
    });
  }

  openAddAnnouncementForm() {
    this.editingAnnouncementId = null;
    this.announcementFormData = { title: '', content: '' };
    this.showAnnouncementForm = true;
  }

  openEditAnnouncementForm(a: TripAnnouncement) {
    this.editingAnnouncementId = a.id;
    this.announcementFormData = { title: a.title, content: a.content ?? '' };
    this.showAnnouncementForm = true;
  }

  closeAnnouncementForm() {
    this.showAnnouncementForm = false;
    this.editingAnnouncementId = null;
    this.announcementFormData = { title: '', content: '' };
  }

  saveAnnouncement() {
    if (!this.announcementFormData.title) return;
    if (this.editingAnnouncementId) {
      this.tripService.updateAnnouncement(this.editingAnnouncementId, this.announcementFormData).subscribe({
        next: () => { this.loadAnnouncements(); this.closeAnnouncementForm(); }
      });
    } else {
      this.tripService.createAnnouncement(this.tripId, this.announcementFormData).subscribe({
        next: () => { this.loadAnnouncements(); this.closeAnnouncementForm(); }
      });
    }
  }

  deleteAnnouncement(aid: number) {
    this.tripService.deleteAnnouncement(aid).subscribe({
      next: () => {
        this.loadAnnouncements();
        this.confirmingDeleteAnnouncementId = null;
      }
    });
  }

  togglePin(aid: number) {
    this.tripService.togglePin(aid).subscribe({
      next: () => this.loadAnnouncements()
    });
  }

  //  編輯行程

  editForm = {
    title: '',
    description: '',
    tripType: '',
    startAt: '',
    endAt: '',
    capacity: 2,
    coverImageUrl: '',
    coverImagePublicId: ''
  };

  openEditModal() {
    if (!this.trip) return;
    this.showStartPicker = false;
    this.showEndPicker = false;
    this.editForm = {
      title: this.trip.title,
      description: this.trip.description ?? '',
      tripType: this.trip.tripType,
      startAt: new Date(this.trip.startAt).toISOString().split('T')[0],
      endAt: this.trip.endAt ? new Date(this.trip.endAt).toISOString().split('T')[0] : '',
      capacity: this.trip.capacity,
      coverImageUrl: this.trip.coverImageUrl ?? '',
      coverImagePublicId: ''
    };
    this.coverPreview = this.trip.coverImageUrl ?? '';
    this.showEditModal = true;
  }

  saveEdit() {
    if (this.isUploading) {
      this.notify.show('圖片上傳中，請稍後再儲存', 'error');
      return;
    }
    this.isUpdating = true;
    this.tripService.updateTrip(this.tripId, {
      ...this.editForm,
      endAt: this.editForm.endAt || null,
      coverImageUrl: this.editForm.coverImageUrl || null,
      coverImagePublicId: this.editForm.coverImagePublicId || null
    }).subscribe({
      next: () => {
        this.notify.show('行程更新成功！', 'success');
        this.showEditModal = false;
        this.loadTrip();
        this.isUpdating = false;
      },
      error: () => this.isUpdating = false
    });
  }

  // 封面上傳

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) this.uploadCover(file);
  }

  onCoverSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.uploadCover(file);
  }

  async uploadCover(file: File) {
    this.isUploading = true;
    const reader = new FileReader();
    reader.onload = () => this.coverPreview = reader.result as string;
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'salter-trip');
    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dn5drigh2/image/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (!res.ok) {
        console.error('Cloudinary 上傳失敗:', data);
        this.notify.show('圖片上傳失敗', 'error');
        this.coverPreview = this.editForm.coverImageUrl;
        return;
      }

      this.editForm.coverImageUrl = data.secure_url;
      this.editForm.coverImagePublicId = data.public_id;
    } catch {
      this.notify.show('圖片上傳失敗', 'error');
      this.coverPreview = this.editForm.coverImageUrl;
    } finally {
      this.isUploading = false;
    }
  }

  removeCover() {
    this.editForm.coverImageUrl = '';
    this.editForm.coverImagePublicId = '';
    this.coverPreview = '';
  }

  //  日期選擇

  onStartDateChange(event: Event) {
    const value = (event as CustomEvent).detail ?? (event.target as any).value ?? '';
    this.editForm.startAt = value;
    this.showStartPicker = false;
    if (this.editForm.endAt && this.editForm.endAt < value) {
      this.editForm.endAt = '';
    }
  }

  onEndDateChange(event: Event) {
    const value = (event as CustomEvent).detail ?? (event.target as any).value ?? '';
    this.editForm.endAt = value;
    this.showEndPicker = false;
  }

  //  刪除行程

  confirmDelete() {
    this.isDeleting = true;
    this.tripService.deleteTrip(this.tripId).subscribe({
      next: () => {
        this.notify.show('行程已刪除', 'success');
        this.router.navigate(['/trip/explore']);
      },
      error: () => this.isDeleting = false
    });
  }
  showShareLink = false;

  copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      this.notify.show('已複製行程連結！', 'success');
      this.showShareLink = false;
    });
  }
  fillDemoGear1() {
    this.gearFormData = { itemName: '海洋友善防曬乳', isRequired: true };
    this.showGearForm = true;
  }

  fillDemoGear2() {
    this.gearFormData = { itemName: '防水袋（放置手機與錢包）', isRequired: false };
    this.showGearForm = true;
  }

  fillDemoAnnouncement1() {
    this.announcementFormData = {
      title: '安全優先',
      content: '衝浪受天氣影響極大，若當日長浪過大或有雷雨預報，活動將於前一天 20:00 前通知取消或延期。'
    };
    this.showAnnouncementForm = true;
  }

  fillDemoAnnouncement2() {
    this.announcementFormData = {
      title: '保護海洋',
      content: '蜜月灣沙灘美景得來不易，個人垃圾請隨手帶走，並嚴禁觸摸周邊礁石生物。'
    };
    this.showAnnouncementForm = true;
  }
}
