import { TestBed } from '@angular/core/testing';

import { DataSubmissionService } from './data-submission.service';

describe('DataSubmissionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataSubmissionService = TestBed.get(DataSubmissionService);
    expect(service).toBeTruthy();
  });
});
