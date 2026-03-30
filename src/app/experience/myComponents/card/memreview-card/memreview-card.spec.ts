import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemreviewCard } from './memreview-card';

describe('MemreviewCard', () => {
  let component: MemreviewCard;
  let fixture: ComponentFixture<MemreviewCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemreviewCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemreviewCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
