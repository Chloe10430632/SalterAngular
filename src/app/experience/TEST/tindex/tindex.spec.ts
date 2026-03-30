import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tindex } from './tindex';

describe('Tindex', () => {
  let component: Tindex;
  let fixture: ComponentFixture<Tindex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tindex]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tindex);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
