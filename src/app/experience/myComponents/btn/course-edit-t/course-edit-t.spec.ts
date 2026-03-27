import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseEditT } from './course-edit-t';

describe('CourseEditT', () => {
  let component: CourseEditT;
  let fixture: ComponentFixture<CourseEditT>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseEditT]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseEditT);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
