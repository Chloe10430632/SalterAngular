import { TestBed } from '@angular/core/testing';

import { CourseForOne } from './course-for-one';

describe('CourseForOne', () => {
  let service: CourseForOne;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseForOne);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
