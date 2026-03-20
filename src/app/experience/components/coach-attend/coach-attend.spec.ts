import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachAttend } from './coach-attend';

describe('CoachAttend', () => {
  let component: CoachAttend;
  let fixture: ComponentFixture<CoachAttend>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachAttend]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachAttend);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
