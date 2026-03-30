import { TestBed } from '@angular/core/testing';

import { CourseForOneS } from './course-for-one';

describe('CourseForOne', () => {
  let service: CourseForOneS;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseForOneS);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
