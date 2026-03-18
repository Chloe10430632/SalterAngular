import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TripQuery, ApiResponse, TripListResult, TripSummary, TripDetail, TripAnnouncement, TripGearItem, TripLocation, TripReminder, TripCity, TripDistrict } from '../interfaces/trip';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private http = inject(HttpClient);
  private baseUrl = 'https://localhost:7017/api/trip/Trip';

  //處理所有API呼叫
  // ── 行程 ──

  // 取得行程列表
  getTrips(query: {
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
  }): Observable<ApiResponse<TripListResult>> {
    let params = new HttpParams();
    if (query.keyword) params = params.set('keyword', query.keyword);
    if (query.tripType) params = params.set('tripType', query.tripType);
    if (query.status) params = params.set('status', query.status);
    if (query.cityId) params = params.set('cityId', query.cityId);
    if (query.startFrom) params = params.set('startFrom', query.startFrom);
    if (query.startTo) params = params.set('startTo', query.startTo);
    if (query.minCapacity) params = params.set('minCapacity', query.minCapacity);
    if (query.maxCapacity) params = params.set('maxCapacity', query.maxCapacity);
    if (query.sortBy) params = params.set('sortBy', query.sortBy);
    if (query.page) params = params.set('page', query.page);
    if (query.pageSize) params = params.set('pageSize', query.pageSize);
    return this.http.get<ApiResponse<TripListResult>>(this.baseUrl, { params });
  }

  // 取得行程詳情
  getTripById(id: number): Observable<ApiResponse<TripDetail>> {
    return this.http.get<ApiResponse<TripDetail>>(`${this.baseUrl}/${id}`);
  }

  // 建立行程
  createTrip(dto: any): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(this.baseUrl, dto);
  }

  // 更新行程
  updateTrip(id: number, dto: any): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.baseUrl}/${id}`, dto);
  }

  // 刪除行程
  deleteTrip(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/${id}`);
  }

  // ── 成員 ──

  joinTrip(id: number): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.baseUrl}/${id}/join`, {});
  }

  leaveTrip(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/${id}/leave`);
  }

  // ── 收藏 ──

  getFavorites(): Observable<ApiResponse<TripSummary[]>> {
    return this.http.get<ApiResponse<TripSummary[]>>(`${this.baseUrl}/favorites`);
  }

  addFavorite(tripId: number): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.baseUrl}/${tripId}/favorite`, {});
  }

  removeFavorite(tripId: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/${tripId}/favorite`);
  }

  // ── 公告 ──

  getAnnouncements(tripId: number): Observable<ApiResponse<TripAnnouncement[]>> {
    return this.http.get<ApiResponse<TripAnnouncement[]>>(`${this.baseUrl}/${tripId}/announcements`);
  }

  createAnnouncement(tripId: number, dto: any): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.baseUrl}/${tripId}/announcements`, dto);
  }

  updateAnnouncement(announcementId: number, dto: any): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.baseUrl}/announcements/${announcementId}`, dto);
  }

  deleteAnnouncement(announcementId: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/announcements/${announcementId}`);
  }

  togglePin(announcementId: number): Observable<ApiResponse<string>> {
    return this.http.patch<ApiResponse<string>>(`${this.baseUrl}/announcements/${announcementId}/pin`, {});
  }

  // ── 裝備 ──

  getGearItems(tripId: number): Observable<ApiResponse<TripGearItem[]>> {
    return this.http.get<ApiResponse<TripGearItem[]>>(`${this.baseUrl}/${tripId}/gearitems`);
  }

  createGearItem(tripId: number, dto: any): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.baseUrl}/${tripId}/gearitems`, dto);
  }

  updateGearItem(gearItemId: number, dto: any): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.baseUrl}/gearitems/${gearItemId}`, dto);
  }

  deleteGearItem(gearItemId: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/gearitems/${gearItemId}`);
  }

  toggleGearCheck(gearItemId: number): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.baseUrl}/gearitems/${gearItemId}/check`, {});
  }

  // ── 地點 ──

  getLocations(tripId: number): Observable<ApiResponse<TripLocation[]>> {
    return this.http.get<ApiResponse<TripLocation[]>>(`${this.baseUrl}/${tripId}/locations`);
  }

  createLocation(tripId: number, dto: any): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.baseUrl}/${tripId}/locations`, dto);
  }

  updateLocation(locationId: number, dto: any): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.baseUrl}/locations/${locationId}`, dto);
  }

  deleteLocation(locationId: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/locations/${locationId}`);
  }

  // ── 提醒 ──

  getReminders(tripId: number): Observable<ApiResponse<TripReminder[]>> {
    return this.http.get<ApiResponse<TripReminder[]>>(`${this.baseUrl}/${tripId}/reminders`);
  }

  createReminder(tripId: number, dto: any): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.baseUrl}/${tripId}/reminders`, dto);
  }

  updateReminder(reminderId: number, dto: any): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.baseUrl}/reminders/${reminderId}`, dto);
  }

  toggleReminder(reminderId: number): Observable<ApiResponse<string>> {
    return this.http.patch<ApiResponse<string>>(`${this.baseUrl}/reminders/${reminderId}/toggle`, {});
  }

  // ── 城市 ──

  getCities(): Observable<ApiResponse<TripCity[]>> {
    return this.http.get<ApiResponse<TripCity[]>>(`${this.baseUrl}/cities`);
  }

  getDistricts(cityId: number): Observable<ApiResponse<TripDistrict[]>> {
    return this.http.get<ApiResponse<TripDistrict[]>>(`${this.baseUrl}/cities/${cityId}/districts`);
  }
}
