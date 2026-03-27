import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachCourseTemp } from './coach-course-temp';

describe('CoachCourseTemp', () => {
  let component: CoachCourseTemp;
  let fixture: ComponentFixture<CoachCourseTemp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachCourseTemp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachCourseTemp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
