// 行程列表查詢條件
export interface TripQuery {
  keyword?: string;
  tripType?: string;
  status?: string;
  cityId?: number;
  startFrom?: string;
  startTo?: string;
  minCapacity?: number;
  maxCapacity?: number;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

// API 通用回傳格式
export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  details: string[] | null;
}

// 行程列表結果
export interface TripListResult {
  trips: TripSummary[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 行程卡片
export interface TripSummary {
  id: number;
  title: string;
  tripType: string;
  description: string;
  startAt: string;
  endAt: string;
  capacity: number;
  memberCount: number;
  status: string;
  coverImageUrl: string | null;
  organizerName: string;
  favoriteCount: number;
  createdAt: string;
  isFavorite?: boolean; // 前端加的
  folderId?: number | null;
}

// 行程詳情
export interface TripDetail extends TripSummary {
  organizerUserId: number;
  organizerEmail: string;
  lockedAt: string | null;
  updatedAt: string;
  members: TripMember[];
  locations: TripLocation[];
  announcementCount: number;
  gearItemCount: number;
  organizerProfilePicture: string | null;
}

// 成員
export interface TripMember {
  userId: number;
  userName: string;
  email: string;
  role: string;
  joinedAt: string;
  profilePicture: string | null;
}

// 地點
export interface TripLocation {
  id: number;
  locationName: string;
  cityName: string;
  districtName: string;
  locationRole: string;
  note: string;
  sortOrder: number;
  dayNumber: number;
  lat?: number | null;
  lng?: number | null;
}

// 公告
export interface TripAnnouncement {
  id: number;
  title: string;
  content: string;
  isPinned: boolean;
  createdByUserId: number;
  createdAt: string;
  updatedAt: string;
}

// 裝備
export interface TripGearItem {
  id: number;
  itemName: string;
  isRequired: boolean;
  isCheckedByMe: boolean;
  checkedCount: number;
  checkedMembers: CheckedMember[];
}

export interface CheckedMember {
  userId: number;
  userName: string;
  isChecked: boolean;
}

// 提醒
export interface TripReminder {
  id: number;
  remindOffsetMinutes: number;
  isEnabled: boolean;
  lastSentAt: string | null;
}

// 城市
export interface TripCity {
  id: number;
  name: string;
}

// 行政區
export interface TripDistrict {
  id: number;
  name: string;
}

//所有地點
export interface TripLocationSearch {
  id: number;
  placeId?: string;
  name: string;
  addressText?: string;
  lat: number;
  lng: number;
  cityName?: string;
  districtName?: string;

}

//收藏資料夾
export interface TripFavoriteFolder {
  id: number;
  name: string;
  favoriteCount: number;
  createdAt: string;
}

export interface MoveFavoriteToFolderDto {
  folderId: number | null;
}
