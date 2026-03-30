import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachPf } from './coach-pf';

describe('CoachPf', () => {
  let component: CoachPf;
  let fixture: ComponentFixture<CoachPf>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachPf]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachPf);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
