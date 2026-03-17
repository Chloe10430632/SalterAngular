import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithNavbar } from './with-navbar';

describe('WithNavbar', () => {
  let component: WithNavbar;
  let fixture: ComponentFixture<WithNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithNavbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithNavbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
