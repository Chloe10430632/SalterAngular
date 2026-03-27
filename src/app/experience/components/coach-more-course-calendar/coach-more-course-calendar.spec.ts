import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachMoreCourseCalendar } from './coach-more-course-calendar';

describe('CoachMoreCourseCalendar', () => {
  let component: CoachMoreCourseCalendar;
  let fixture: ComponentFixture<CoachMoreCourseCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachMoreCourseCalendar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachMoreCourseCalendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
