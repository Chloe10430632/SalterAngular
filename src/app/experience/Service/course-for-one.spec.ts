import { TestBed } from '@angular/core/testing';

import { CourseS } from './course-for-one';

describe('CourseForOne', () => {
  let service: CourseS;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseS);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
