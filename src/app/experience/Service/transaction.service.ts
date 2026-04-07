import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment'; // 依你的路徑調整
import { DCourseOrder, DTransacRequest } from '../Interfaces/IItransac';

//============!!這是Service!!===================//
//============!!交易!!===================//

@Injectable({ providedIn: 'root' })
export class TransactionServiceS {

  constructor(private http: HttpClient) { }

  reserve(dto: DCourseOrder): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Exp/Exp/Reserve`, dto);
  }
  /**
   * 取得綠界付款表單 HTML
   * 後端回傳 Content-Type: text/html，直接拿字串
   */
  getOrderForm(dto: DTransacRequest): Observable<string> {
    return this.http.post(
      `${environment.apiUrl}/Transac/Transaction/GetOrderForm`,
      dto, { responseType: 'text' }
    );
  }
}
