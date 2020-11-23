import { TestBed } from '@angular/core/testing';

import { TCModalService } from './modal.service';

describe('TCModalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TCModalService = TestBed.get(TCModalService);
    expect(service).toBeTruthy();
  });
});
