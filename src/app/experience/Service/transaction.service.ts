import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment'; // 依你的路徑調整

export interface DTransacRequest {
  transactionId: number;
  itemName: string;
}

// 如果你的 API 回傳的是 DAPIResponse<string> 包裝格式，用這個 interface
interface DAPIResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly baseUrl = `${environment.apiUrl}/api/Transac/Transaction`;

  constructor(private http: HttpClient) { }

  /**
   * 取得綠界付款表單 HTML
   * 後端回傳 Content-Type: text/html，直接拿字串
   */
  getOrderForm(dto: DTransacRequest): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/GetOrderForm`,
      dto,
      { responseType: 'text' }   // 關鍵：後端 return Content(html, "text/html")
    );
  }
}
