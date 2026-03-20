import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Coachintro } from './coachintro';

describe('Coachintro', () => {
  let component: Coachintro;
  let fixture: ComponentFixture<Coachintro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Coachintro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Coachintro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
