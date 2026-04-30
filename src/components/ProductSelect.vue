<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { GiftProduct } from '../data/giftProducts';

const uiText = {
  label: '\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043f\u043e\u0434\u0430\u0440\u043e\u043a',
  empty: '\u0412\u0441\u0435 \u043f\u043e\u0434\u0430\u0440\u043a\u0438 \u0443\u0436\u0435 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u044b',
  add: '\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c',
};

const props = defineProps<{
  products: GiftProduct[];
}>();

const emit = defineEmits<{
  add: [productId: string];
}>();

const selectedId = ref('');
const hasProducts = computed(() => props.products.length > 0);

watch(
  () => props.products,
  (products) => {
    if (!products.some((product) => product.id === selectedId.value)) {
      selectedId.value = products[0]?.id ?? '';
    }
  },
  { immediate: true },
);

function addSelected(): void {
  if (!selectedId.value) {
    return;
  }

  emit('add', selectedId.value);
}
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row">
    <label class="sr-only" for="gift-product">{{ uiText.label }}</label>
    <select
      id="gift-product"
      v-model="selectedId"
      class="party-input min-h-14 flex-1"
      :disabled="!hasProducts"
    >
      <option v-if="!hasProducts" value="">{{ uiText.empty }}</option>
      <option v-for="product in props.products" :key="product.id" :value="product.id">
        {{ product.name }}
      </option>
    </select>
    <button
      class="h-14 rounded-full bg-[#ffe600] px-7 text-sm font-black uppercase text-[#12162c] shadow-[0_6px_0_#be8d00] transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-4 focus:ring-white/70 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
      type="button"
      :disabled="!selectedId"
      @click="addSelected"
    >
      {{ uiText.add }}
    </button>
  </div>
</template>
