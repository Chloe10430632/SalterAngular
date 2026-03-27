import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseMemOrder } from './course-mem-order';

describe('CourseMemOrder', () => {
  let component: CourseMemOrder;
  let fixture: ComponentFixture<CourseMemOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseMemOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseMemOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
