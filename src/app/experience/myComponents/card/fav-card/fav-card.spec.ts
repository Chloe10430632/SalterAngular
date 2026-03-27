import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavCard } from './fav-card';

describe('FavCard', () => {
  let component: FavCard;
  let fixture: ComponentFixture<FavCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
