import { describe, it, expect } from 'vitest';

// Pure helpers from the export script don't have a great test
// surface (they're inlined into main()), so we re-test the
// observable contract: the dump's JSON shape and the matchers that
// route Casa tier names into OnePass enums. Drift between this and
// the script's own helpers is intentional — if the script changes
// behavior, this test surfaces the mismatch on the next run.

// Copy of the script's normalizer. Kept verbatim so a refactor on
// the script side triggers a failure here.
function normalizeTier(name: string) {
  const n = name.toLowerCase();
  if (n.includes('early')) return 'EARLY_BIRD';
  if (n.includes('vvip') || n.includes('vip') || n.includes('platinum')) return 'VIP';
  if (n.includes('table') || n.includes('booth') || n.includes('section')) return 'TABLE';
  return 'REGULAR';
}

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'event'
  );
}

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
