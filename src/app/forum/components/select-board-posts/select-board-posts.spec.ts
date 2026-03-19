import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBoardPosts } from './select-board-posts';

describe('SelectBoardPosts', () => {
  let component: SelectBoardPosts;
  let fixture: ComponentFixture<SelectBoardPosts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectBoardPosts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectBoardPosts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
