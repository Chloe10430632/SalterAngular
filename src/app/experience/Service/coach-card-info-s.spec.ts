import { TestBed } from '@angular/core/testing';

import { CoachCardInfoS } from './coach-card-info-s';

describe('CoachCardInfoS', () => {
  let service: CoachCardInfoS;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoachCardInfoS);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
