import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CityGroupDTO, HouseListDTO, HousePreviewDTO } from '../interface/ihouse';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class HouseService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // 共享的人數狀態

  adultCount: number = 0
  childCount: number = 0

  // 取得所有城市名稱 (純字串陣列)
  getCities(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/Home/cities`);
  }

  // 取得房源列表，支援城市篩選
  getHouseGroups(city?: string): Observable<CityGroupDTO[]> {
    let params = new HttpParams();
    // 如果有傳入城市名稱，就加入 Query String
    if (city && city !== '全部') {
      params = params.set('city', city);
    }
    return this.http.get<CityGroupDTO[]>(`${this.apiUrl}/Home/city-groups`, { params });
  }

  getHouseDetail(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Home/${id}`);
  }

  getSearchHouses(
    city: string,
    guests?: number,
    startDate?: string,
    endDate?: string
  ): Observable<HousePreviewDTO[]> {
    let params = new HttpParams();
    if (city && city !== '全部') params = params.set('citie', city);
    // if (keyword) params = params.set('keyword', keyword);
    if (guests && guests > 0) params = params.set('PeopleCount', guests.toString());
    if (startDate) params = params.set('StartDate', startDate);
    if (endDate) params = params.set('EndDate', endDate);
    // 💡 對應到你後端 [HttpGet("search")] 的那個 Action
    return this.http.get<HousePreviewDTO[]>(`${this.apiUrl}/Home/select`, { params });
  }

  // 新增預約
  createBooking(dto: any): Observable<any> {
    const url = `${this.apiUrl}/Home/createBookingId`;
    return this.http.post<any>(url, dto);
  }

  getCloudinaryThumb(url: string): string {
    if (!url || !url.includes('cloudinary')) return url;
    return url.replace('/upload/', '/upload/c_fill,w_600,h_600,g_auto/');
  }
  // 取得所有房源清單
  getHouses(): Observable<HouseListDTO[]> {
    return this.http.get<HouseListDTO[]>(`${this.apiUrl}/Home`);
  }

  getCityGroups(): Observable<CityGroupDTO[]> {
    return this.http.get<CityGroupDTO[]>(`${this.apiUrl}/Home/city-groups`);
  }

  changeAdult(delta: number) {
    this.adultCount += delta;
    if (this.adultCount < 0) this.adultCount = 0; // 防止變成負數
  }

  changeChild(delta: number) {
    this.childCount += delta;
    if (this.childCount < 0) this.childCount = 0;
  }


}
