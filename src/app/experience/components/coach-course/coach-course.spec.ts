import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachCourse } from './coach-course';

describe('CoachCourse', () => {
  let component: CoachCourse;
  let fixture: ComponentFixture<CoachCourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachCourse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachCourse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
