import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseTempList } from './course-temp-list';

describe('CourseTempList', () => {
  let component: CourseTempList;
  let fixture: ComponentFixture<CourseTempList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseTempList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseTempList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
