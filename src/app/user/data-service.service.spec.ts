import { TestBed } from '@angular/core/testing';

import { DataProvider } from './data-provider.service';

describe('DataProvider', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataProvider = TestBed.get(DataProvider);
    expect(service).toBeTruthy();
  });
});
