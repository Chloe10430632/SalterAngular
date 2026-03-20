import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerPersonalFnc } from './container-personal-fnc';

describe('ContainerPersonalFnc', () => {
  let component: ContainerPersonalFnc;
  let fixture: ComponentFixture<ContainerPersonalFnc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContainerPersonalFnc]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContainerPersonalFnc);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
