import { TestBed } from '@angular/core/testing';

import { ProductApiServicesService } from './product-api-services.service';

describe('ProductApiServicesService', () => {
  let service: ProductApiServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductApiServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
