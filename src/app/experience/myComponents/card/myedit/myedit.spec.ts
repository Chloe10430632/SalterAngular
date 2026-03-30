import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Myedit } from './myedit';

describe('Myedit', () => {
  let component: Myedit;
  let fixture: ComponentFixture<Myedit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Myedit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Myedit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
