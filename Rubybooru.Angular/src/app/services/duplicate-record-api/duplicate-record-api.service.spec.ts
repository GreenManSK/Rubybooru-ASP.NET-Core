import { TestBed } from '@angular/core/testing';

import { DuplicateRecordApiService } from './duplicate-record-api.service';

describe('DuplicateRecordApiService', () => {
  let service: DuplicateRecordApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DuplicateRecordApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
