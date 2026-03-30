import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachPFEdit } from './coach-pfedit';

describe('CoachPFEdit', () => {
  let component: CoachPFEdit;
  let fixture: ComponentFixture<CoachPFEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachPFEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachPFEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
