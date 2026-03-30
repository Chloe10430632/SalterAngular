import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Noavatar } from './noavatar';

describe('Noavatar', () => {
  let component: Noavatar;
  let fixture: ComponentFixture<Noavatar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Noavatar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Noavatar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
