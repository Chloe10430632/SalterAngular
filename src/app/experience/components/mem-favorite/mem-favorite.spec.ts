import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachFavorite } from './coach-favorite';

describe('CoachFavorite', () => {
  let component: CoachFavorite;
  let fixture: ComponentFixture<CoachFavorite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachFavorite]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachFavorite);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
