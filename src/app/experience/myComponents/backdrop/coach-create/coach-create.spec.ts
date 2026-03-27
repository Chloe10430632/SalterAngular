import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachCreate } from './coach-create';

describe('CoachCreate', () => {
  let component: CoachCreate;
  let fixture: ComponentFixture<CoachCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
