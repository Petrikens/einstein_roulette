<script setup lang="ts">
const props = defineProps<{
  open: boolean;
  title: string;
  resultLabel: string;
  resultMeta?: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const sparks = Array.from({ length: 28 }, (_, index) => index);
</script>

<template>
  <Transition name="modal">
    <div
      v-if="props.open"
      class="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-[#12162c]/78 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      @click.self="emit('close')"
    >
      <div class="fireworks" aria-hidden="true">
        <span
          v-for="spark in sparks"
          :key="spark"
          :style="{
            '--i': spark,
            '--angle': `${spark * 13}deg`,
            '--delay': `${(spark % 7) * 80}ms`,
            '--distance': `${110 + (spark % 5) * 18}px`,
          }"
        />
      </div>
      <section
        v-motion
        :initial="{ opacity: 0, scale: 0.94, y: 20 }"
        :enter="{ opacity: 1, scale: 1, y: 0 }"
        class="relative z-10 w-full max-w-[calc(100vw-2rem)] rounded-[2rem] border-[3px] border-white bg-[#e82010] p-6 text-center shadow-[0_12px_0_#7c140d,0_30px_70px_rgba(0,0,0,0.35)] sm:max-w-md sm:p-8"
      >
        <p class="text-sm font-black uppercase tracking-[0.28em] text-[#ffe600]">{{ props.title }}</p>
        <h2 class="result-title mt-4 text-[1.7rem] font-black uppercase leading-[0.98] tracking-wide text-white text-party-shadow sm:text-4xl">
          {{ props.resultLabel }}
        </h2>
        <p v-if="props.resultMeta" class="mt-3 text-sm font-black text-white/85">{{ props.resultMeta }}</p>
        <button
          class="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-[#ffe600] px-7 text-sm font-black uppercase text-[#12162c] shadow-[0_6px_0_#be8d00] transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-white/70"
          type="button"
          @click="emit('close')"
        >
          Закрыть
        </button>
      </section>
    </div>
  </Transition>
</template>
