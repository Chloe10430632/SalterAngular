import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnCoachSwitch } from './btn-coach-switch';

describe('BtnCoachSwitch', () => {
  let component: BtnCoachSwitch;
  let fixture: ComponentFixture<BtnCoachSwitch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnCoachSwitch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnCoachSwitch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
