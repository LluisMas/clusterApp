import { TestBed } from '@angular/core/testing';

import { DataSubjectService } from './data-subject.service';

describe('DataSubjectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataSubjectService = TestBed.get(DataSubjectService);
    expect(service).toBeTruthy();
  });
});
