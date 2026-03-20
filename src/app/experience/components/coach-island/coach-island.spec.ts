import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachIsland } from './coach-island';

describe('CoachIsland', () => {
  let component: CoachIsland;
  let fixture: ComponentFixture<CoachIsland>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachIsland]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachIsland);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
