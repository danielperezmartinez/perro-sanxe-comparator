import { TestBed } from '@angular/core/testing';

import { SupabaseService } from './supabase';

describe('SupabaseService', () => {
  let service: SupabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returns an empty array for an empty query', async () => {
    await expect(service.searchArticulos('')).resolves.toEqual([]);
  });
});
