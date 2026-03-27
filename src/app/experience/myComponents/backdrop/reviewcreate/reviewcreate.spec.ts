import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reviewcreate } from './reviewcreate';

describe('Reviewcreate', () => {
  let component: Reviewcreate;
  let fixture: ComponentFixture<Reviewcreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reviewcreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reviewcreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
