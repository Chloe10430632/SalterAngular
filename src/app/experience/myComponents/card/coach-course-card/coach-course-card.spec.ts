import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachCourseCard } from './coach-course-card';

describe('CoachCourseCard', () => {
  let component: CoachCourseCard;
  let fixture: ComponentFixture<CoachCourseCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachCourseCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachCourseCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
