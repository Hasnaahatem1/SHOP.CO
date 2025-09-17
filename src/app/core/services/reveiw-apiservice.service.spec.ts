import { TestBed } from '@angular/core/testing';

import { ReveiwAPIServiceService } from './reveiw-apiservice.service';

describe('ReveiwAPIServiceService', () => {
  let service: ReveiwAPIServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReveiwAPIServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
