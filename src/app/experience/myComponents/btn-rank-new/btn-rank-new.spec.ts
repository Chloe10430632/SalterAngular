import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnRankNew } from './btn-rank-new';

describe('BtnRankNew', () => {
  let component: BtnRankNew;
  let fixture: ComponentFixture<BtnRankNew>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnRankNew]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnRankNew);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
