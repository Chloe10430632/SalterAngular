import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LittleIsland } from './little-island';

describe('LittleIsland', () => {
  let component: LittleIsland;
  let fixture: ComponentFixture<LittleIsland>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LittleIsland]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LittleIsland);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
