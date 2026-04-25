<script setup lang="ts">
import { computed, ref } from 'vue';
import ProductSelect from './ProductSelect.vue';
import ResultModal from './ResultModal.vue';
import SelectedGiftList from './SelectedGiftList.vue';
import Wheel from './Wheel.vue';
import { giftProducts, giftWeight, type GiftProduct } from '../data/giftProducts';
import { formatPrice } from '../lib/formatPrice';
import type { WheelItem } from '../types/wheel';

const selectedIds = ref<string[]>(['book-relativity', 'coffee-kit', 'puzzle']);
const winner = ref<WheelItem<GiftProduct> | null>(null);
const modalOpen = ref(false);

const selectedProducts = computed(() =>
  selectedIds.value
    .map((id) => giftProducts.find((product) => product.id === id))
    .filter((product): product is GiftProduct => product !== undefined),
);

const availableProducts = computed(() =>
  giftProducts.filter((product) => !selectedIds.value.includes(product.id)),
);

const giftItems = computed<WheelItem<GiftProduct>[]>(() =>
  selectedProducts.value.map((product) => ({
    id: product.id,
    label: product.name,
    weight: giftWeight(product.price),
    value: product,
  })),
);

function addGift(productId: string): void {
  if (selectedIds.value.includes(productId)) {
    return;
  }

  selectedIds.value = [...selectedIds.value, productId];
}

function removeGift(productId: string): void {
  selectedIds.value = selectedIds.value.filter((id) => id !== productId);
}

function handleSpinEnd(item: WheelItem): void {
  const product = item.value as GiftProduct | undefined;

  if (!product) {
    return;
  }

  winner.value = { ...item, value: product };
  modalOpen.value = true;
}

function closeModal(): void {
  if (winner.value) {
    removeGift(winner.value.id);
  }

  modalOpen.value = false;
  winner.value = null;
}
</script>

<template>
  <section
    v-motion
    :initial="{ opacity: 0, y: 24 }"
    :enter="{ opacity: 1, y: 0, transition: { delay: 180 } }"
    class="roulette-window"
  >
    <ProductSelect :products="availableProducts" @add="addGift" />
    <SelectedGiftList :products="selectedProducts" @remove="removeGift" />

    <div class="mt-5 flex-1">
      <Wheel :items="giftItems" empty-text="Пусто" @spin-end="handleSpinEnd" />
    </div>

    <ResultModal
      :open="modalOpen"
      title="Подарок выпал"
      :result-label="winner?.label ?? ''"
      :result-meta="winner?.value ? formatPrice(winner.value.price) : undefined"
      @close="closeModal"
    />
  </section>
</template>
