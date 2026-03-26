import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachBuycourse } from './coach-buycourse';

describe('CoachBuycourse', () => {
  let component: CoachBuycourse;
  let fixture: ComponentFixture<CoachBuycourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachBuycourse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachBuycourse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
