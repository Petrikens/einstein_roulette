import { describe, expect, it } from 'vitest';
import { pickWeightedIndex } from './weightedRandom';

describe('pickWeightedIndex', () => {
  it('selects the sector containing the random weighted target', () => {
    expect(pickWeightedIndex([1, 3, 6], () => 0.39)).toBe(1);
    expect(pickWeightedIndex([1, 3, 6], () => 0.99)).toBe(2);
  });

  it('returns null for empty or non-positive collections', () => {
    expect(pickWeightedIndex([], () => 0.5)).toBeNull();
    expect(pickWeightedIndex([0, -1], () => 0.5)).toBeNull();
  });
});
