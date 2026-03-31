import { TestBed } from '@angular/core/testing';

import { CoachS } from './coach-s';

describe('CoachS', () => {
  let service: CoachS;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoachS);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
