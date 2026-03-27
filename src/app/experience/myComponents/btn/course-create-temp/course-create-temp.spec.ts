import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCreateTemp } from './course-create-temp';

describe('CourseCreateTemp', () => {
  let component: CourseCreateTemp;
  let fixture: ComponentFixture<CourseCreateTemp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseCreateTemp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseCreateTemp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
