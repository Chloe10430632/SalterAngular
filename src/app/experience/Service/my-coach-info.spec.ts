import { TestBed } from '@angular/core/testing';

import { MyCoachInfoS } from './my-coach-info';

describe('MyCoachInfoS', () => {
  let service: MyCoachInfoS;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyCoachInfoS);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
