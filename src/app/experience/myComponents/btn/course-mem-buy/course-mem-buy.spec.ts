import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseMemBuy } from './course-mem-buy';

describe('CourseMemBuy', () => {
  let component: CourseMemBuy;
  let fixture: ComponentFixture<CourseMemBuy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseMemBuy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseMemBuy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
