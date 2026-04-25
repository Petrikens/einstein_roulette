import type { WheelItem } from '../types/wheel';

export interface WheelSegment<TValue = unknown> {
  item: WheelItem<TValue>;
  startAngle: number;
  endAngle: number;
  centerAngle: number;
  path: string;
  labelX: number;
  labelY: number;
  labelRotation: number;
  largeArc: boolean;
}

interface PolarPoint {
  x: number;
  y: number;
}

const FULL_CIRCLE = 360;
const CENTER = 100;
const RADIUS = 96;
const LABEL_RADIUS = 59;

function normalizeDegrees(value: number): number {
  return ((value % FULL_CIRCLE) + FULL_CIRCLE) % FULL_CIRCLE;
}

function polarPoint(angle: number, radius: number): PolarPoint {
  const radians = (angle * Math.PI) / 180;

  return {
    x: CENTER + radius * Math.sin(radians),
    y: CENTER - radius * Math.cos(radians),
  };
}

function sectorPath(startAngle: number, endAngle: number): string {
  const sweep = endAngle - startAngle;

  if (sweep >= FULL_CIRCLE) {
    return [
      `M ${CENTER} ${CENTER - RADIUS}`,
      `A ${RADIUS} ${RADIUS} 0 1 1 ${CENTER - 0.01} ${CENTER - RADIUS}`,
      `A ${RADIUS} ${RADIUS} 0 1 1 ${CENTER} ${CENTER - RADIUS}`,
      'Z',
    ].join(' ');
  }

  const start = polarPoint(startAngle, RADIUS);
  const end = polarPoint(endAngle, RADIUS);
  const largeArc = sweep > 180 ? 1 : 0;

  return [
    `M ${CENTER} ${CENTER}`,
    `L ${start.x.toFixed(3)} ${start.y.toFixed(3)}`,
    `A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x.toFixed(3)} ${end.y.toFixed(3)}`,
    'Z',
  ].join(' ');
}

export function buildWheelSegments<TValue>(items: readonly WheelItem<TValue>[]): WheelSegment<TValue>[] {
  const validItems = items.filter((item) => Number.isFinite(item.weight) && item.weight > 0);
  const total = validItems.reduce((sum, item) => sum + item.weight, 0);

  if (total <= 0) {
    return [];
  }

  let cursor = 0;

  return validItems.map((item) => {
    const sweep = (item.weight / total) * FULL_CIRCLE;
    const startAngle = cursor;
    const endAngle = cursor + sweep;
    const centerAngle = startAngle + sweep / 2;
    const labelPoint = polarPoint(centerAngle, LABEL_RADIUS);
    cursor = endAngle;

    return {
      item,
      startAngle,
      endAngle,
      centerAngle,
      path: sectorPath(startAngle, endAngle),
      labelX: labelPoint.x,
      labelY: labelPoint.y,
      labelRotation: normalizeDegrees(centerAngle) > 180 ? centerAngle + 180 : centerAngle,
      largeArc: sweep > 180,
    };
  });
}

export function getTargetRotation(
  selected: Pick<WheelSegment, 'centerAngle'>,
  currentRotation: number,
  fullTurns = 6,
): number {
  const currentNormalized = normalizeDegrees(currentRotation);
  const targetNormalized = normalizeDegrees(-selected.centerAngle);
  const delta = normalizeDegrees(targetNormalized - currentNormalized);

  return currentRotation + fullTurns * FULL_CIRCLE + delta;
}
