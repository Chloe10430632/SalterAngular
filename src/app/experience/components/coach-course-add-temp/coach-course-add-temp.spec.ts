import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachCourseAddTemp } from './coach-course-add-temp';

describe('CoachCourseAddTemp', () => {
  let component: CoachCourseAddTemp;
  let fixture: ComponentFixture<CoachCourseAddTemp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachCourseAddTemp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachCourseAddTemp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
