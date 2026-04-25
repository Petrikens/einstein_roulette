import type { WheelItem } from '../types/wheel';

export interface ParticipantValue {
  name: string;
  sourceIndex: number;
}

export function parseParticipants(input: string): WheelItem<ParticipantValue>[] {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((name) => name.length > 0)
    .map((name, sourceIndex) => ({
      id: `participant-${sourceIndex}`,
      label: name,
      weight: 1,
      value: { name, sourceIndex },
    }));
}
