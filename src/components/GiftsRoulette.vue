<script setup lang="ts">
import { computed, ref } from 'vue';
import GiftsModal from './GiftsModal.vue';
import ResultModal from './ResultModal.vue';
import Wheel from './Wheel.vue';
import { giftProducts } from '../data/giftProducts';
import {
  appendAllGiftSelections,
  appendGiftSelection,
  buildGiftWheelItems,
  createInitialGiftSelections,
  mapSelectedGiftProducts,
  removeGiftSelection,
  type SelectedGiftProduct,
} from '../lib/giftRoulette';
import { resolveWheelShortcutEnabled } from '../lib/wheelShortcut';
import type { WheelItem } from '../types/wheel';

const uiText = {
  editGifts: '\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043f\u043e\u0434\u0430\u0440\u043a\u0438',
  empty: '\u041f\u0443\u0441\u0442\u043e',
  resultTitle: '\u041f\u043e\u0434\u0430\u0440\u043e\u043a \u0432\u044b\u043f\u0430\u043b',
};

const props = defineProps<{
  isActive: boolean;
}>();

const selectedGifts = ref(createInitialGiftSelections(giftProducts));
const winner = ref<WheelItem<SelectedGiftProduct> | null>(null);
const resultModalOpen = ref(false);
const giftsModalOpen = ref(false);

const selectedProducts = computed(() =>
  mapSelectedGiftProducts(selectedGifts.value, giftProducts),
);
const shortcutEnabled = computed(() =>
  resolveWheelShortcutEnabled(props.isActive, giftsModalOpen.value, resultModalOpen.value),
);

const giftItems = computed(() =>
  buildGiftWheelItems(selectedGifts.value, giftProducts),
);

function addGift(productId: string): void {
  selectedGifts.value = appendGiftSelection(selectedGifts.value, productId);
}

function addAllGifts(): void {
  selectedGifts.value = appendAllGiftSelections(selectedGifts.value, giftProducts);
}

function removeGift(selectionId: string): void {
  selectedGifts.value = removeGiftSelection(selectedGifts.value, selectionId);
}

function handleSpinEnd(item: WheelItem): void {
  const product = item.value;

  if (
    !product
    || typeof product !== 'object'
    || !('id' in product)
    || !('name' in product)
    || !('price' in product)
    || !('selectionId' in product)
  ) {
    return;
  }

  winner.value = {
    ...item,
    value: product as SelectedGiftProduct,
  };
  resultModalOpen.value = true;
}

function closeResultModal(): void {
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
      :title="uiText.editGifts"
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
      :empty-text="uiText.empty"
      fullscreen
      :spin-duration-ms="6000"
      :extra-spins="10"
      :shortcut-enabled="shortcutEnabled"
      @spin-end="handleSpinEnd"
    />

    <ResultModal
      :open="resultModalOpen"
      :title="uiText.resultTitle"
      :result-label="winner?.label ?? ''"
      @close="closeResultModal"
    />

    <GiftsModal
      :open="giftsModalOpen"
      :available-products="giftProducts"
      :selected-products="selectedProducts"
      @add="addGift"
      @add-all="addAllGifts"
      @remove="removeGift"
      @close="giftsModalOpen = false"
    />
  </section>
</template>
