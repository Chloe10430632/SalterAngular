import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachProfile } from './coach-profile';

describe('CoachProfile', () => {
  let component: CoachProfile;
  let fixture: ComponentFixture<CoachProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
