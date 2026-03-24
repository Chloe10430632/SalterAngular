import { TestBed } from '@angular/core/testing';

import { BoardInteractionsService } from './board-interactions-service';

describe('BoardInteractionsService', () => {
  let service: BoardInteractionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardInteractionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
