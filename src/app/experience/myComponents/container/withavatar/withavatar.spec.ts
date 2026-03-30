import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Withavatar } from './withavatar';

describe('Withavatar', () => {
  let component: Withavatar;
  let fixture: ComponentFixture<Withavatar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Withavatar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Withavatar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
