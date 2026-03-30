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
    console.log('isMember:', this.isMember, 'currentUserId:', this.currentUserId);
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
      next: () => this.loadGearItems()
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
      next: () => this.loadAnnouncements()
    });
  }

  togglePin(aid: number) {
    this.tripService.togglePin(aid).subscribe({
      next: () => this.loadAnnouncements()
    });
  }


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

    // 本地預覽（不等上傳完成就先顯示）
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
      this.editForm.coverImageUrl = data.secure_url;
      this.editForm.coverImagePublicId = data.public_id;
    } catch {
      this.notify.show('圖片上傳失敗', 'error');
      this.coverPreview = this.editForm.coverImageUrl; // 還原預覽
    } finally {
      this.isUploading = false;
    }
  }

  removeCover() {
    this.editForm.coverImageUrl = '';
    this.editForm.coverImagePublicId = '';
    this.coverPreview = '';
  }

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
}
