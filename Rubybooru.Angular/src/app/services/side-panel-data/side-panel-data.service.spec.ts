import { TestBed } from '@angular/core/testing';

import { SidePanelDataService } from './side-panel-data.service';

describe('SidePanelDataService', () => {
  let service: SidePanelDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidePanelDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
