import { TestBed } from '@angular/core/testing';

import { CountyStateService } from './county-state.service';

describe('CountyStateService', () => {
  let service: CountyStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountyStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
