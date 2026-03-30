import { TestBed } from '@angular/core/testing';

import { SensitiveWordsService } from './sensitive-words-service';

describe('SensitiveWordsService', () => {
  let service: SensitiveWordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SensitiveWordsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
