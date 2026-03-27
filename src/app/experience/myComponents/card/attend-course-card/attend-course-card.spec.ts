import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendCourseCard } from './attend-course-card';

describe('AttendCourseCard', () => {
  let component: AttendCourseCard;
  let fixture: ComponentFixture<AttendCourseCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendCourseCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendCourseCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
