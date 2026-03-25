import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchHouses } from './search-houses';

describe('SearchHouses', () => {
  let component: SearchHouses;
  let fixture: ComponentFixture<SearchHouses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchHouses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchHouses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
