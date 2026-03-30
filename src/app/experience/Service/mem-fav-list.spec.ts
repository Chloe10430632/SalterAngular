import { TestBed } from '@angular/core/testing';

import { MemFavListS } from '../Service/mem-fav-list';

describe('MemFavListS', () => {
  let service: MemFavListS;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemFavListS);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
