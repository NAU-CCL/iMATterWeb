import { TestBed } from '@angular/core/testing';

import { ResourceReviewQuestionsService } from './resource-review-questions.service';

describe('ResourceReviewQuestionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResourceReviewQuestionsService = TestBed.get(ResourceReviewQuestionsService);
    expect(service).toBeTruthy();
  });
});
