import { TestBed } from '@angular/core/testing';

import { BackDropService } from './back-drop.service';

describe('BackDropService', () => {
  let service: BackDropService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackDropService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
