import { TestBed } from '@angular/core/testing';

import { CoachAllInfoS } from './coach-all-info-s';

describe('CoachAllInfoS', () => {
  let service: CoachAllInfoS;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoachAllInfoS);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
