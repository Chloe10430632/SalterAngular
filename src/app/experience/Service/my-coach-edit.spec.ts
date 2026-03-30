import { TestBed } from '@angular/core/testing';

import { MyCoachEdit } from './my-coach-edit';

describe('MyCoachEdit', () => {
  let service: MyCoachEdit;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyCoachEdit);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
