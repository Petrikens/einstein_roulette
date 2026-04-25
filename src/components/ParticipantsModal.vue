<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: string;
  open: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  close: [];
}>();

const localInput = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
});
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
          <h2 class="mb-4 text-xl font-black uppercase text-white">Список участников</h2>

          <label class="sr-only" for="participants">Имена участников</label>
          <textarea
            id="participants"
            v-model="localInput"
            class="party-input mb-5 min-h-52 w-full resize-y"
            placeholder="Введите имена, по одному на строку"
          />

          <div class="flex justify-end">
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
