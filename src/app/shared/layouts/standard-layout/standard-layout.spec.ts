import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardLayout } from './standard-layout';

describe('StandardLayout', () => {
  let component: StandardLayout;
  let fixture: ComponentFixture<StandardLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandardLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
