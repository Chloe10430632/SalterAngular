import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TripStateService {
  isMember = signal(false);
}
