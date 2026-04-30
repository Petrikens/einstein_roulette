import { describe, expect, it } from 'vitest';
import { parseParticipants } from './parseParticipants';

describe('parseParticipants', () => {
  it('ignores empty lines and trims names while preserving duplicates', () => {
    expect(parseParticipants(' Ada \n\nAlbert\nAda\n  ')).toEqual([
      {
        id: 'participant-0',
        label: 'Ada',
        wheelLabel: '1',
        weight: 1,
        value: { name: 'Ada', sourceIndex: 0 },
      },
      {
        id: 'participant-1',
        label: 'Albert',
        wheelLabel: '2',
        weight: 1,
        value: { name: 'Albert', sourceIndex: 1 },
      },
      {
        id: 'participant-2',
        label: 'Ada',
        wheelLabel: '3',
        weight: 1,
        value: { name: 'Ada', sourceIndex: 2 },
      },
    ]);
  });
});
