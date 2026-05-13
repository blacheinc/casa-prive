import { describe, it, expect } from 'vitest';
import {
  normalizeTier,
  slugify,
  tierHintFor,
  toMinor,
} from './export-for-onepass-migration';

// Tests import the real helpers from the export script so the
// script's behaviour and the test's assertions stay in lockstep —
// previously the tests redeclared the helpers inline, which meant a
// behavioural change on the script side could silently pass.

describe('normalizeTier', () => {
  it('routes early-bird variants to EARLY_BIRD', () => {
    expect(normalizeTier('Early Bird')).toBe('EARLY_BIRD');
    expect(normalizeTier('EARLY_BIRD')).toBe('EARLY_BIRD');
    expect(normalizeTier('Early access')).toBe('EARLY_BIRD');
  });

  it('routes VIP / VVIP / platinum to VIP', () => {
    expect(normalizeTier('VIP')).toBe('VIP');
    expect(normalizeTier('VVIP table')).toBe('VIP');
    expect(normalizeTier('Platinum')).toBe('VIP');
  });

  it('routes table / booth / section to TABLE', () => {
    expect(normalizeTier('Table for 6')).toBe('TABLE');
    expect(normalizeTier('Booth')).toBe('TABLE');
    expect(normalizeTier('Section B')).toBe('TABLE');
  });

  it('defaults to REGULAR', () => {
    expect(normalizeTier('General Admission')).toBe('REGULAR');
    expect(normalizeTier('Standard')).toBe('REGULAR');
    expect(normalizeTier('')).toBe('REGULAR');
  });
});

describe('slugify', () => {
  it('lowercases and replaces non-alnum with hyphens', () => {
    expect(slugify('Launch Night!')).toBe('launch-night');
    expect(slugify('Founders’ Soirée')).toBe('founders-soir-e');
  });

  it('collapses repeated separators', () => {
    expect(slugify('a   b   c')).toBe('a-b-c');
  });

  it('strips leading and trailing hyphens', () => {
    expect(slugify('---Hello---')).toBe('hello');
  });

  it('falls back to "event" on empty / pure-symbol input', () => {
    expect(slugify('')).toBe('event');
    expect(slugify('!!!')).toBe('event');
  });

  it('caps at 80 chars', () => {
    expect(slugify('a'.repeat(120)).length).toBeLessThanOrEqual(80);
  });
});

describe('tierHintFor', () => {
  it('maps PREMIUM to VIP', () => {
    expect(tierHintFor('PREMIUM')).toBe('VIP');
  });
  it('maps STANDARD (and anything else) to Standard', () => {
    expect(tierHintFor('STANDARD')).toBe('Standard');
    expect(tierHintFor('OTHER')).toBe('Standard');
  });
});

describe('toMinor', () => {
  it('multiplies float NGN by 100 and rounds to int kobo', () => {
    expect(toMinor(50000)).toBe(5_000_000);
    expect(toMinor(0.01)).toBe(1);
    expect(toMinor(0.005)).toBe(1); // rounds to nearest int
    expect(toMinor(0.004)).toBe(0);
  });
});
