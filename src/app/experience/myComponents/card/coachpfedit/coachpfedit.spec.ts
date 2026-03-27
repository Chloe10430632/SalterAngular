import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Coachpfedit } from './coachpfedit';

describe('Coachpfedit', () => {
  let component: Coachpfedit;
  let fixture: ComponentFixture<Coachpfedit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Coachpfedit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Coachpfedit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
