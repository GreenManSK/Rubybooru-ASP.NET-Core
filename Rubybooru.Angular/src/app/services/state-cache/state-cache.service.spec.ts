import { TestBed } from '@angular/core/testing';

import { StateCacheService } from './state-cache.service';

describe('StateCacheService', () => {
  let service: StateCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
