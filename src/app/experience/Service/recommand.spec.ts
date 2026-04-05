import { TestBed } from '@angular/core/testing';

import { Recommand } from './recommand';

describe('Recommand', () => {
  let service: Recommand;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Recommand);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
