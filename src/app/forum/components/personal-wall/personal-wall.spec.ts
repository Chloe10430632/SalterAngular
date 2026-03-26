import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalWall } from './personal-wall';

describe('PersonalWall', () => {
  let component: PersonalWall;
  let fixture: ComponentFixture<PersonalWall>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalWall]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalWall);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
