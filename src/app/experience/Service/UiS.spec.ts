import { TestBed } from '@angular/core/testing';

import { UiS } from './UiS';

describe('Notice', () => {
  let service: UiS;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiS);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
