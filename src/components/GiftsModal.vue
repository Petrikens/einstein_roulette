<script setup lang="ts">
import { computed } from 'vue';
import ProductSelect from './ProductSelect.vue';
import SelectedGiftList from './SelectedGiftList.vue';
import type { GiftProduct } from '../data/giftProducts';
import type { SelectedGiftProduct } from '../lib/giftRoulette';

const uiText = {
  title: '\u0421\u043f\u0438\u0441\u043e\u043a \u043f\u043e\u0434\u0430\u0440\u043a\u043e\u0432',
  addAll: '\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0432\u0441\u0435',
  save: '\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c',
};

const props = defineProps<{
  open: boolean;
  availableProducts: GiftProduct[];
  selectedProducts: SelectedGiftProduct[];
}>();

const emit = defineEmits<{
  add: [productId: string];
  addAll: [];
  remove: [selectionId: string];
  close: [];
}>();

const hasAvailableProducts = computed(() => props.availableProducts.length > 0);
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 overflow-y-auto bg-black/50 px-3 py-3 sm:px-4 sm:py-6"
        @click.self="emit('close')"
      >
        <div
          class="mx-auto flex max-h-[calc(100dvh-1.5rem)] w-full max-w-xl flex-col overflow-hidden rounded-[2rem] border-[3px] border-white bg-[#e82010] p-4 shadow-[0_12px_0_#7c140d,0_30px_70px_rgba(0,0,0,0.35)] sm:max-h-[calc(100dvh-3rem)] sm:p-6"
        >
          <h2 class="mb-4 shrink-0 text-lg font-black uppercase text-white sm:text-xl">
            {{ uiText.title }}
          </h2>

          <ProductSelect :products="availableProducts" @add="emit('add', $event)" />

          <div class="mt-4 flex shrink-0 justify-end">
            <button
              class="inline-flex h-11 items-center justify-center rounded-full border-[3px] border-white bg-[#12162c] px-6 text-sm font-black uppercase text-white shadow-[0_5px_0_rgba(0,0,0,0.25)] transition hover:bg-[#1b2141] focus:outline-none focus:ring-4 focus:ring-white/70 disabled:cursor-not-allowed disabled:border-white/40 disabled:bg-[#2c3152] disabled:text-white/50 disabled:shadow-none"
              type="button"
              :disabled="!hasAvailableProducts"
              @click="emit('addAll')"
            >
              {{ uiText.addAll }}
            </button>
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto pr-1">
            <SelectedGiftList :products="selectedProducts" @remove="emit('remove', $event)" />
          </div>

          <div class="mt-5 flex shrink-0 justify-end">
            <button
              class="inline-flex h-12 items-center justify-center rounded-full bg-[#ffe600] px-7 text-sm font-black uppercase text-[#12162c] shadow-[0_6px_0_#be8d00] transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-white/70"
              type="button"
              @click="emit('close')"
            >
              {{ uiText.save }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
