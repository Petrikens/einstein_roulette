<script setup lang="ts">
const uiText = {
  shortcut: '\u041f\u0440\u043e\u0431\u0435\u043b \u2014 \u043a\u0440\u0443\u0442\u0438\u0442\u044c',
  empty: '\u0421\u043f\u0438\u0441\u043e\u043a \u043f\u043e\u043a\u0430 \u043f\u0443\u0441\u0442',
};

defineProps<{
  title: string;
  items: {
    id: string;
    number: number;
    label: string;
  }[];
}>();
</script>

<template>
  <aside
    class="fixed bottom-3 left-3 z-[45] w-[min(24rem,calc(100vw-1.5rem))] rounded-[1.75rem] border border-white/20 bg-[#12162c]/85 p-3 text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-md sm:bottom-5 sm:left-6 sm:w-[22rem] sm:p-4"
  >
    <div class="flex items-center justify-between gap-3">
      <h3 class="text-sm font-black uppercase tracking-[0.08em] text-white sm:text-base">
        {{ title }}
      </h3>
      <span class="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase text-white/80 sm:text-[11px]">
        {{ uiText.shortcut }}
      </span>
    </div>

    <div class="mt-3 max-h-[min(38vh,22rem)] overflow-y-auto pr-1">
      <ul v-if="items.length > 0" class="space-y-2">
        <li
          v-for="item in items"
          :key="item.id"
          class="flex items-start gap-3 rounded-2xl bg-white/8 px-3 py-2"
        >
          <span
            class="mt-0.5 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[#ffe600] px-2 text-xs font-black text-[#12162c]"
          >
            {{ item.number }}
          </span>
          <span class="min-w-0 text-sm font-bold leading-5 text-white/92">
            {{ item.label }}
          </span>
        </li>
      </ul>

      <div
        v-else
        class="rounded-2xl border border-white/10 bg-white/5 px-3 py-4 text-center text-sm font-bold uppercase text-white/70"
      >
        {{ uiText.empty }}
      </div>
    </div>
  </aside>
</template>
