import { TestBed } from '@angular/core/testing';

import { HeartPredictionService } from './heart-prediction.service';

describe('HeartPredictionService', () => {
  let service: HeartPredictionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeartPredictionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
