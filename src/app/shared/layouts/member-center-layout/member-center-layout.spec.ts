import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberCenterLayout } from './member-center-layout';

describe('MemberCenterLayout', () => {
  let component: MemberCenterLayout;
  let fixture: ComponentFixture<MemberCenterLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberCenterLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberCenterLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
