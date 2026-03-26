import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paylist } from './paylist';

describe('Paylist', () => {
  let component: Paylist;
  let fixture: ComponentFixture<Paylist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Paylist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Paylist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
