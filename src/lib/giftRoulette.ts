import type { GiftProduct } from '../data/giftProducts';
import type { WheelItem } from '../types/wheel';

export interface GiftSelection {
  selectionId: string;
  productId: string;
}

export interface SelectedGiftProduct extends GiftProduct {
  selectionId: string;
}

function defaultSelectionId(): string {
  return globalThis.crypto.randomUUID();
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

function getProductMap(products: readonly GiftProduct[]): Map<string, GiftProduct> {
  return new Map(products.map((product) => [product.id, product]));
}

export function appendGiftSelection(
  selections: readonly GiftSelection[],
  productId: string,
  createId: () => string = defaultSelectionId,
): GiftSelection[] {
  return [
    ...selections,
    {
      selectionId: createId(),
      productId,
    },
  ];
}

export function appendAllGiftSelections(
  selections: readonly GiftSelection[],
  products: readonly GiftProduct[],
  createId: () => string = defaultSelectionId,
): GiftSelection[] {
  return products.reduce<GiftSelection[]>(
    (nextSelections, product) => appendGiftSelection(nextSelections, product.id, createId),
    [...selections],
  );
}

export function createInitialGiftSelections(
  _products: readonly GiftProduct[],
  _createId: () => string = defaultSelectionId,
): GiftSelection[] {
  return [];
}

export function removeGiftSelection(
  selections: readonly GiftSelection[],
  selectionId: string,
): GiftSelection[] {
  return selections.filter((selection) => selection.selectionId !== selectionId);
}

export function mapSelectedGiftProducts(
  selections: readonly GiftSelection[],
  products: readonly GiftProduct[],
): SelectedGiftProduct[] {
  const productMap = getProductMap(products);

  return selections
    .map((selection) => {
      const product = productMap.get(selection.productId);

      if (!product) {
        return undefined;
      }

      return {
        ...product,
        selectionId: selection.selectionId,
      };
    })
    .filter(isDefined);
}

export function buildGiftWheelItems(
  selections: readonly GiftSelection[],
  products: readonly GiftProduct[],
): WheelItem<SelectedGiftProduct>[] {
  return mapSelectedGiftProducts(selections, products).map((product, index) => ({
    id: product.selectionId,
    label: product.name,
    wheelLabel: String(index + 1),
    weight: 1,
    value: product,
  }));
}
