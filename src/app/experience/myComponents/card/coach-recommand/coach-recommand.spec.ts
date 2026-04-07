import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachRecommand } from './coach-recommand';

describe('CoachRecommand', () => {
  let component: CoachRecommand;
  let fixture: ComponentFixture<CoachRecommand>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachRecommand]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachRecommand);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
