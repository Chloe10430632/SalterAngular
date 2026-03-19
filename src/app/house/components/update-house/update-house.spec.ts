import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateHouse } from './update-house';

describe('UpdateHouse', () => {
  let component: UpdateHouse;
  let fixture: ComponentFixture<UpdateHouse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateHouse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateHouse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
