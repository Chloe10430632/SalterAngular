import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePublish } from './course-publish';

describe('CoursePublish', () => {
  let component: CoursePublish;
  let fixture: ComponentFixture<CoursePublish>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursePublish]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursePublish);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
