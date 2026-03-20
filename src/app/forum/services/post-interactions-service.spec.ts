import { TestBed } from '@angular/core/testing';

import { PostInteractionsService } from './post-interactions-service';

describe('PostInteractionsService', () => {
  let service: PostInteractionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostInteractionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
