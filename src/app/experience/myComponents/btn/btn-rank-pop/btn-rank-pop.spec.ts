import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnRankPop } from './btn-rank-pop';

describe('BtnRankPop', () => {
  let component: BtnRankPop;
  let fixture: ComponentFixture<BtnRankPop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnRankPop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnRankPop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
