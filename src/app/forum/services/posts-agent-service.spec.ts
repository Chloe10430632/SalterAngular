import { TestBed } from '@angular/core/testing';

import { PostsAgentService } from './posts-agent-service';

describe('PostsAgentService', () => {
  let service: PostsAgentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostsAgentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
