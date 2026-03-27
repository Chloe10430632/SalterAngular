import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewSwitch } from './review-switch';

describe('ReviewSwitch', () => {
  let component: ReviewSwitch;
  let fixture: ComponentFixture<ReviewSwitch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewSwitch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewSwitch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
