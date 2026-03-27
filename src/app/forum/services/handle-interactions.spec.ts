import { TestBed } from '@angular/core/testing';

import { HandleInteractions } from './handle-interactions';

describe('HandleInteractions', () => {
  let service: HandleInteractions;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandleInteractions);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
