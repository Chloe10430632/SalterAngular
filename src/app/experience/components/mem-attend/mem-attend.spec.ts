import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemAttend } from './mem-attend';

describe('MemAttend', () => {
  let component: MemAttend;
  let fixture: ComponentFixture<MemAttend>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemAttend]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemAttend);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
