import { TestBed } from '@angular/core/testing';

import { BuyCourseSession } from './buy-course-session';

describe('BuyCourseSession', () => {
  let service: BuyCourseSession;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuyCourseSession);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
