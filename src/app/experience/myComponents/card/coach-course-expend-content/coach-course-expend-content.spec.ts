import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachCourseExpendContent } from './coach-course-expend-content';

describe('CoachCourseExpendContent', () => {
  let component: CoachCourseExpendContent;
  let fixture: ComponentFixture<CoachCourseExpendContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachCourseExpendContent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachCourseExpendContent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
