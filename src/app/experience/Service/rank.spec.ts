import { TestBed } from '@angular/core/testing';

import { Rank } from './rank';

describe('Rank', () => {
  let service: Rank;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Rank);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
