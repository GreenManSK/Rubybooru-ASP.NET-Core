import { TestBed } from '@angular/core/testing';

import { UrlParserService } from './url-parser.service';

describe('UrlParserService', () => {
  let service: UrlParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
