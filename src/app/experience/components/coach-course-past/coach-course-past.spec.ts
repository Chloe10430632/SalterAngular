import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachCoursePast } from './coach-course-past';

describe('CoachCoursePast', () => {
  let component: CoachCoursePast;
  let fixture: ComponentFixture<CoachCoursePast>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachCoursePast]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachCoursePast);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
