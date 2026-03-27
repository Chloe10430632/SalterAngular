import { TestBed } from '@angular/core/testing';

import { TripState } from './trip-state';

describe('TripState', () => {
  let service: TripState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
