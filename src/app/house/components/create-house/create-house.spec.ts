import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHouse } from './create-house';

describe('CreateHouse', () => {
  let component: CreateHouse;
  let fixture: ComponentFixture<CreateHouse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateHouse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateHouse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
