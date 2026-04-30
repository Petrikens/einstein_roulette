import { describe, expect, it } from 'vitest';
import type { GiftProduct } from '../data/giftProducts';
import {
  appendAllGiftSelections,
  appendGiftSelection,
  buildGiftWheelItems,
  createInitialGiftSelections,
  removeGiftSelection,
} from './giftRoulette';

const products: GiftProduct[] = [
  { id: 'magnet', name: '\u041c\u0430\u0433\u043d\u0438\u0442', price: 1 },
  { id: 'mug', name: '\u041a\u0440\u0443\u0436\u043a\u0430 + \u043c\u0430\u0433\u043d\u0438\u0442', price: 9 },
];

function createIdFactory(ids: readonly string[]): () => string {
  let index = 0;

  return () => {
    const nextId = ids[index];
    index += 1;

    return nextId ?? `generated-${index}`;
  };
}

describe('giftRoulette', () => {
  it('starts with an empty gift selection list', () => {
    expect(createInitialGiftSelections(products)).toEqual([]);
  });

  it('builds equal-weight wheel items for duplicate gift selections', () => {
    const createId = createIdFactory(['gift-1', 'gift-2']);

    let selections = appendGiftSelection([], 'magnet', createId);
    selections = appendGiftSelection(selections, 'magnet', createId);

    expect(buildGiftWheelItems(selections, products)).toEqual([
      {
        id: 'gift-1',
        label: '\u041c\u0430\u0433\u043d\u0438\u0442',
        wheelLabel: '1',
        weight: 1,
        value: {
          id: 'magnet',
          name: '\u041c\u0430\u0433\u043d\u0438\u0442',
          price: 1,
          selectionId: 'gift-1',
        },
      },
      {
        id: 'gift-2',
        label: '\u041c\u0430\u0433\u043d\u0438\u0442',
        wheelLabel: '2',
        weight: 1,
        value: {
          id: 'magnet',
          name: '\u041c\u0430\u0433\u043d\u0438\u0442',
          price: 1,
          selectionId: 'gift-2',
        },
      },
    ]);
  });

  it('removes only one selected gift instance', () => {
    const createId = createIdFactory(['gift-1', 'gift-2', 'gift-3']);

    let selections = appendAllGiftSelections([], products, createId);
    selections = appendGiftSelection(selections, 'magnet', createId);

    expect(removeGiftSelection(selections, 'gift-3')).toEqual([
      { selectionId: 'gift-1', productId: 'magnet' },
      { selectionId: 'gift-2', productId: 'mug' },
    ]);
  });
});
