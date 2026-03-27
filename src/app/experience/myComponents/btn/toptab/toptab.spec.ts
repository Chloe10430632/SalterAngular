import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Toptab } from './toptab';

describe('Toptab', () => {
  let component: Toptab;
  let fixture: ComponentFixture<Toptab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Toptab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Toptab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
