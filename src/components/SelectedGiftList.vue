<script setup lang="ts">
import type { SelectedGiftProduct } from '../lib/giftRoulette';

const uiText = {
  empty: '\u0421\u043f\u0438\u0441\u043e\u043a \u043f\u043e\u0434\u0430\u0440\u043a\u043e\u0432 \u043f\u0443\u0441\u0442',
};

const props = defineProps<{
  products: SelectedGiftProduct[];
}>();

const emit = defineEmits<{
  remove: [selectionId: string];
}>();

function removeAriaLabel(productName: string): string {
  return `\u0423\u0434\u0430\u043b\u0438\u0442\u044c ${productName}`;
}
</script>

<template>
  <div class="mt-4">
    <ul v-if="props.products.length > 0" class="space-y-2">
      <li
        v-for="product in props.products"
        :key="product.selectionId"
        class="flex items-center justify-between gap-3 rounded-3xl border-[3px] border-white bg-[#12162c] px-4 py-3 shadow-[0_5px_0_rgba(0,0,0,0.25)]"
      >
        <div class="min-w-0">
          <p class="truncate text-sm font-black uppercase text-white">{{ product.name }}</p>
        </div>
        <button
          class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-xl font-black leading-none text-[#e82010] transition hover:bg-[#ffe600] focus:outline-none focus:ring-4 focus:ring-white/70"
          type="button"
          :aria-label="removeAriaLabel(product.name)"
          @click="emit('remove', product.selectionId)"
        >
          &times;
        </button>
      </li>
    </ul>

    <div
      v-else
      class="rounded-[1.5rem] border-[3px] border-white/70 bg-[#12162c]/70 px-4 py-5 text-center text-sm font-black uppercase text-white/80 shadow-[0_5px_0_rgba(0,0,0,0.18)]"
    >
      {{ uiText.empty }}
    </div>
  </div>
</template>
