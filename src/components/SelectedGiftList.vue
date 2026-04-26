<script setup lang="ts">
import type { GiftProduct } from '../data/giftProducts';

const props = defineProps<{
  products: GiftProduct[];
}>();

const emit = defineEmits<{
  remove: [productId: string];
}>();
</script>

<template>
  <div class="mt-4">
    <ul v-if="props.products.length > 0" class="space-y-2">
      <li
        v-for="product in props.products"
        :key="product.id"
        class="flex items-center justify-between gap-3 rounded-3xl border-[3px] border-white bg-[#12162c] px-4 py-3 shadow-[0_5px_0_rgba(0,0,0,0.25)]"
      >
        <div class="min-w-0">
          <p class="truncate text-sm font-black uppercase text-white">{{ product.name }}</p>
        </div>
        <button
          class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-xl font-black leading-none text-[#e82010] transition hover:bg-[#ffe600] focus:outline-none focus:ring-4 focus:ring-white/70"
          type="button"
          :aria-label="`Удалить ${product.name}`"
          @click="emit('remove', product.id)"
        >
          ×
        </button>
      </li>
    </ul>

    <div
      v-else
      class="rounded-[1.5rem] border-[3px] border-white/70 bg-[#12162c]/70 px-4 py-5 text-center text-sm font-black uppercase text-white/80 shadow-[0_5px_0_rgba(0,0,0,0.18)]"
    >
      Список подарков пуст
    </div>
  </div>
</template>
