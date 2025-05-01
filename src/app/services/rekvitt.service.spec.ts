import { TestBed } from '@angular/core/testing';

import { RekvittService } from './rekvitt.service';

describe('RekvittService', () => {
  let service: RekvittService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RekvittService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
