import { TestBed } from '@angular/core/testing';

import { KvitterService } from './kvitter.service';

describe('KvitterService', () => {
  let service: KvitterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KvitterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
