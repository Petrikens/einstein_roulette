<script setup lang="ts">
import { ref } from 'vue';
import GiftsRoulette from './components/GiftsRoulette.vue';
import ParticipantsRoulette from './components/ParticipantsRoulette.vue';

type Screen = 'participants' | 'gifts';

const activeScreen = ref<Screen>('participants');
</script>

<template>
  <main class="party-stage h-screen text-white">
    <div class="party-background-art" aria-hidden="true">
      <img
        class="party-background-art__wordmark party-background-art__wordmark--bottom-left"
        src="/assets/party-wordmark.png"
        alt=""
      />
      <img
        class="party-background-art__mascot party-background-art__mascot--top-right"
        src="/assets/einstein-party.png"
        alt=""
      />
    </div>

    <div class="mx-auto flex h-screen w-full max-w-3xl flex-col px-4 py-5 sm:px-6">
      <nav
        class="party-switcher fixed left-4 top-4 z-[70] grid grid-cols-2 gap-3 rounded-full bg-[#12162c] p-2 shadow-[0_8px_0_rgba(0,0,0,0.25)] sm:left-6 sm:top-5"
        aria-label="Выбор рулетки"
      >
        <button
          class="screen-tab"
          :class="{ 'screen-tab-active': activeScreen === 'participants' }"
          type="button"
          @click="activeScreen = 'participants'"
        >
          Участники
        </button>
        <button
          class="screen-tab"
          :class="{ 'screen-tab-active': activeScreen === 'gifts' }"
          type="button"
          @click="activeScreen = 'gifts'"
        >
          Подарки
        </button>
      </nav>

      <div class="flex flex-1">
        <ParticipantsRoulette v-if="activeScreen === 'participants'" />
        <GiftsRoulette v-else />
      </div>
    </div>
  </main>
</template>
