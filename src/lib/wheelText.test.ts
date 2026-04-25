import { describe, expect, it } from 'vitest';
import { splitWheelLabel } from './wheelText';

describe('splitWheelLabel', () => {
  it('keeps short labels on one line', () => {
    expect(splitWheelLabel('Ada')).toEqual(['Ada']);
  });

  it('wraps and truncates long labels without overflowing sector text', () => {
    expect(splitWheelLabel('Планшет для заметок', 12, 2)).toEqual(['Планшет для', 'заметок']);
  });
});
