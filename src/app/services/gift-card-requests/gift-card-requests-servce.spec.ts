import { TestBed } from '@angular/core/testing';

import { GiftCardRequestsService } from './gift-card-requests.service';

describe('GiftCardRequestsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GiftCardRequestsService = TestBed.get(GiftCardRequestsService);
    expect(service).toBeTruthy();
  });
});
