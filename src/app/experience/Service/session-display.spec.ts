import { TestBed } from '@angular/core/testing';

import { SessionDisplayS } from './session-display';

describe('SessionDisplay', () => {
  let service: SessionDisplayS;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionDisplayS);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
