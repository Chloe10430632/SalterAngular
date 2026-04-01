import { TestBed } from '@angular/core/testing';

import { CourseInformationS } from './course-information';

describe('CourseForOne', () => {
  let service: CourseInformationS;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseInformationS);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
