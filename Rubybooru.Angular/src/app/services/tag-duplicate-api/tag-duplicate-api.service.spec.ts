import { TestBed } from '@angular/core/testing';

import { TagDuplicateApiService } from './tag-duplicate-api.service';

describe('TagDuplicateApiService', () => {
  let service: TagDuplicateApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagDuplicateApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
