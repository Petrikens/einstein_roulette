import { describe, expect, it } from 'vitest';
import { buildWheelSegments, getTargetRotation } from './wheelGeometry';

describe('wheelGeometry', () => {
  it('builds proportional sectors with center angles', () => {
    const segments = buildWheelSegments([
      { id: 'a', label: 'A', weight: 1 },
      { id: 'b', label: 'B', weight: 3 },
    ]);

    expect(segments).toHaveLength(2);
    expect(segments[0]?.startAngle).toBeCloseTo(0);
    expect(segments[0]?.endAngle).toBeCloseTo(90);
    expect(segments[1]?.startAngle).toBeCloseTo(90);
    expect(segments[1]?.endAngle).toBeCloseTo(360);
  });

  it('targets the selected sector under the top pointer', () => {
    const rotation = getTargetRotation({ centerAngle: 45 }, 0, 5);

    expect(rotation).toBe(2115);
  });
});
