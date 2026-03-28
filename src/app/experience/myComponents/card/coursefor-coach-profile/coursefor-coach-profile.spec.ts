import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseforCoachProfile } from './coursefor-coach-profile';

describe('CourseforCoachProfile', () => {
  let component: CourseforCoachProfile;
  let fixture: ComponentFixture<CourseforCoachProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseforCoachProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseforCoachProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
