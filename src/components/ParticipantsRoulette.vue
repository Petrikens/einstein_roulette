<script setup lang="ts">
import { computed, ref } from 'vue';
import ParticipantsModal from './ParticipantsModal.vue';
import ResultModal from './ResultModal.vue';
import Wheel from './Wheel.vue';
import { parseParticipants } from '../lib/parseParticipants';
import { resolveWheelShortcutEnabled } from '../lib/wheelShortcut';
import type { WheelItem } from '../types/wheel';

const uiText = {
  editParticipants: '\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0443\u0447\u0430\u0441\u0442\u043d\u0438\u043a\u043e\u0432',
  empty: '\u041f\u0443\u0441\u0442\u043e',
  resultTitle: '\u041f\u043e\u0431\u0435\u0434\u0438\u0442\u0435\u043b\u044c',
};

const props = defineProps<{
  isActive: boolean;
}>();

const input = ref('');
const winner = ref<WheelItem | null>(null);
const resultModalOpen = ref(false);
const participantsModalOpen = ref(false);

const participantItems = computed(() => parseParticipants(input.value));
const shortcutEnabled = computed(() =>
  resolveWheelShortcutEnabled(props.isActive, participantsModalOpen.value, resultModalOpen.value),
);

function handleSpinEnd(item: WheelItem): void {
  winner.value = item;
  resultModalOpen.value = true;
}

function closeResultModal(): void {
  if (winner.value) {
    const nextItems = participantItems.value.filter((item) => item.id !== winner.value?.id);
    input.value = nextItems.map((item) => item.label).join('\n');
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
      :title="uiText.editParticipants"
      @click="participantsModalOpen = true"
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
          d="M15 19.128a9.38 9.38 0 0 0 2.625.372
             9.337 9.337 0 0 0 4.121-.952
             4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003
             c0-1.113-.285-2.16-.786-3.07M15 19.128v.106
             A12.318 12.318 0 0 1 8.624 21
             c-2.331 0-4.512-.645-6.374-1.766l-.001-.109
             a6.375 6.375 0 0 1 11.964-3.07M12 6.375
             a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25
             a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
        />
      </svg>

      <span
        class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center
               rounded-full bg-[#ffe600] text-[10px] font-black text-[#12162c]"
      >
        {{ participantItems.length }}
      </span>
    </button>

    <Wheel
      :items="participantItems"
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

    <ParticipantsModal
      v-model="input"
      :open="participantsModalOpen"
      @close="participantsModalOpen = false"
    />
  </section>
</template>
