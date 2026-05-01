import { describe, expect, it } from 'vitest';
import { resolveWheelShortcutEnabled } from './wheelShortcut';

describe('resolveWheelShortcutEnabled', () => {
  it('disables the shortcut for an inactive wheel screen', () => {
    expect(resolveWheelShortcutEnabled(false, false, false)).toBe(false);
  });

  it('disables the shortcut when a modal or result is open', () => {
    expect(resolveWheelShortcutEnabled(true, true, false)).toBe(false);
    expect(resolveWheelShortcutEnabled(true, false, true)).toBe(false);
  });

  it('enables the shortcut only for the active wheel with no overlays', () => {
    expect(resolveWheelShortcutEnabled(true, false, false)).toBe(true);
  });
});
