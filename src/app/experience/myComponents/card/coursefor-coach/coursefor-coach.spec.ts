import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseforCoach } from './coursefor-coach';

describe('CourseforCoach', () => {
  let component: CourseforCoach;
  let fixture: ComponentFixture<CourseforCoach>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseforCoach]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseforCoach);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
