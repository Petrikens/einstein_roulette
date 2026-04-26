<script setup lang="ts">
import { computed, ref } from 'vue';
import GiftsModal from './GiftsModal.vue';
import ResultModal from './ResultModal.vue';
import Wheel from './Wheel.vue';
import { giftProducts, giftWeight, type GiftProduct } from '../data/giftProducts';
import type { WheelItem } from '../types/wheel';

const selectedIds = ref<string[]>(['book-relativity', 'coffee-kit', 'puzzle']);
const winner = ref<WheelItem<GiftProduct> | null>(null);
const resultModalOpen = ref(false);
const giftsModalOpen = ref(false);

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

function addAllGifts(): void {
  if (availableProducts.value.length === 0) {
    return;
  }

  selectedIds.value = [...selectedIds.value, ...availableProducts.value.map((product) => product.id)];
}

function removeGift(productId: string): void {
  selectedIds.value = selectedIds.value.filter((id) => id !== productId);
}

function handleSpinEnd(item: WheelItem): void {
  const product = item.value;

  if (
    !product
    || typeof product !== 'object'
    || !('id' in product)
    || !('name' in product)
    || !('price' in product)
  ) {
    return;
  }

  winner.value = {
    ...item,
    value: product as GiftProduct,
  };
  resultModalOpen.value = true;
}

function closeResultModal(): void {
  if (winner.value) {
    removeGift(winner.value.id);
  }

  resultModalOpen.value = false;
  winner.value = null;
}
</script>

<template>
  <section class="relative min-h-screen">
    <button
      class="fixed right-4 top-1/2 z-50 -translate-y-1/2
             flex h-14 w-14 items-center justify-center
             rounded-full bg-white/15 text-white
             shadow-lg backdrop-blur-md
             transition-all duration-200
             hover:bg-white/25 hover:scale-110
             focus:outline-none focus:ring-2 focus:ring-white/50
             active:scale-95
             sm:right-6 sm:h-16 sm:w-16"
      title="Редактировать подарки"
      @click="giftsModalOpen = true"
    >
      <svg
        class="h-6 w-6 sm:h-7 sm:w-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.8"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 21V11m0 0H5.25A2.25 2.25 0 0 1 3 8.75V7.5A2.25 2.25 0 0 1 5.25 5.25H12m0 5.75h6.75A2.25 2.25 0 0 0 21 8.75V7.5a2.25 2.25 0 0 0-2.25-2.25H12m0 5.75v10m-3.75-15.75h.008v.008H8.25V5.25Zm7.5 0h.008v.008h-.008V5.25ZM7.5 5.25a2.25 2.25 0 1 1 4.5 0V6H7.5v-.75Zm4.5 0a2.25 2.25 0 1 1 4.5 0V6H12v-.75Z"
        />
      </svg>

      <span
        class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center
               rounded-full bg-[#ffe600] text-[10px] font-black text-[#12162c]"
      >
        {{ selectedProducts.length }}
      </span>
    </button>

    <Wheel
      :items="giftItems"
      empty-text="Пусто"
      fullscreen
      :spin-duration-ms="6000"
      :extra-spins="10"
      @spin-end="handleSpinEnd"
    />

    <ResultModal
      :open="resultModalOpen"
      title="Подарок выпал"
      :result-label="winner?.label ?? ''"
      @close="closeResultModal"
    />

    <GiftsModal
      :open="giftsModalOpen"
      :available-products="availableProducts"
      :selected-products="selectedProducts"
      @add="addGift"
      @add-all="addAllGifts"
      @remove="removeGift"
      @close="giftsModalOpen = false"
    />
  </section>
</template>
