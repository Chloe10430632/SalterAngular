import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseOnshelf } from './course-onshelf';

describe('CourseOnshelf', () => {
  let component: CourseOnshelf;
  let fixture: ComponentFixture<CourseOnshelf>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseOnshelf]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseOnshelf);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
