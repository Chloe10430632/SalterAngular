import { TestBed } from '@angular/core/testing';

import { SCoachPersonalInformation } from './Scoach-personal-information';

describe('CoachPersonalInformation', () => {
  let service: SCoachPersonalInformation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SCoachPersonalInformation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
