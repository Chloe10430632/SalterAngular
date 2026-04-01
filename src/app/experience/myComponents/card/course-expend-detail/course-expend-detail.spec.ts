import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseExpendDetail } from './course-expend-detail';

describe('CourseExpendDetail', () => {
  let component: CourseExpendDetail;
  let fixture: ComponentFixture<CourseExpendDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseExpendDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseExpendDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
