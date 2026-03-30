import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemFavorite } from './mem-favorite';

describe('mem-favorite', () => {
  let component: MemFavorite;
  let fixture: ComponentFixture<MemFavorite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemFavorite]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MemFavorite);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
