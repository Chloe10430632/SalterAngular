import { TestBed } from '@angular/core/testing';

import { SearchS } from './search';

describe('Search', () => {
  let service: SearchS;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchS);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
