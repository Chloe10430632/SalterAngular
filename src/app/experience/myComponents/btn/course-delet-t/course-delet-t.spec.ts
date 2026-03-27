import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDeletT } from './course-delet-t';

describe('CourseDeletT', () => {
  let component: CourseDeletT;
  let fixture: ComponentFixture<CourseDeletT>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDeletT]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseDeletT);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
