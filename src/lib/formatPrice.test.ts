import { describe, expect, it } from 'vitest';
import { formatPrice } from './formatPrice';

describe('formatPrice', () => {
  it('formats prices in rubles without fractional digits', () => {
    expect(formatPrice(12990)).toBe('12 990 ₽');
  });
});
