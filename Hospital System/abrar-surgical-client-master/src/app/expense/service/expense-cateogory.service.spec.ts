import { TestBed } from '@angular/core/testing';

import { ExpenseCateogoryService } from './expense-cateogory.service';

describe('ExpenseCateogoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExpenseCateogoryService = TestBed.get(ExpenseCateogoryService);
    expect(service).toBeTruthy();
  });
});
