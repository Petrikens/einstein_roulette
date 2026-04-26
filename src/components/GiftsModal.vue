<script setup lang="ts">
import { computed } from 'vue';
import ProductSelect from './ProductSelect.vue';
import SelectedGiftList from './SelectedGiftList.vue';
import type { GiftProduct } from '../data/giftProducts';

const props = defineProps<{
  open: boolean;
  availableProducts: GiftProduct[];
  selectedProducts: GiftProduct[];
}>();

const emit = defineEmits<{
  add: [productId: string];
  addAll: [];
  remove: [productId: string];
  close: [];
}>();

const hasAvailableProducts = computed(() => props.availableProducts.length > 0);
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        @click.self="emit('close')"
      >
        <div
          class="w-full max-w-xl rounded-[2rem] border-[3px] border-white bg-[#e82010] p-6 shadow-[0_12px_0_#7c140d,0_30px_70px_rgba(0,0,0,0.35)]"
        >
          <h2 class="mb-4 text-xl font-black uppercase text-white">Список подарков</h2>

          <ProductSelect :products="availableProducts" @add="emit('add', $event)" />

          <div class="mt-4 flex justify-end">
            <button
              class="inline-flex h-11 items-center justify-center rounded-full border-[3px] border-white bg-[#12162c] px-6 text-sm font-black uppercase text-white shadow-[0_5px_0_rgba(0,0,0,0.25)] transition hover:bg-[#1b2141] focus:outline-none focus:ring-4 focus:ring-white/70 disabled:cursor-not-allowed disabled:border-white/40 disabled:bg-[#2c3152] disabled:text-white/50 disabled:shadow-none"
              type="button"
              :disabled="!hasAvailableProducts"
              @click="emit('addAll')"
            >
              Добавить все
            </button>
          </div>

          <SelectedGiftList :products="selectedProducts" @remove="emit('remove', $event)" />

          <div class="mt-5 flex justify-end">
            <button
              class="inline-flex h-12 items-center justify-center rounded-full bg-[#ffe600] px-7 text-sm font-black uppercase text-[#12162c] shadow-[0_6px_0_#be8d00] transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-white/70"
              type="button"
              @click="emit('close')"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
