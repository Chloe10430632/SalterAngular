import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DTransacRequest } from '../Interfaces/IItransac';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BuyCourseSession {
  constructor(private client: HttpClient) { }

  getOrderForm(dto: DTransacRequest): Observable<string> {
    return this.client.post(
      `${environment.apiUrl}/Transaction/GetOrderForm`, dto, { responseType: 'text' }
    );
  }
}
