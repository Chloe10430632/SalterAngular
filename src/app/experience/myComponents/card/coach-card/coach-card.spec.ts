import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachCard } from './coach-card';

describe('CoachCard', () => {
  let component: CoachCard;
  let fixture: ComponentFixture<CoachCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
