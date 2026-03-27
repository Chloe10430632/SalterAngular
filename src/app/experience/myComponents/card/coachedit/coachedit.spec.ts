import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Coachedit } from './coachedit';

describe('Coachedit', () => {
  let component: Coachedit;
  let fixture: ComponentFixture<Coachedit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Coachedit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Coachedit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
