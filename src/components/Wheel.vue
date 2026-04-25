<!-- Wheel.vue -->
<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount, onMounted } from 'vue';
import { buildWheelSegments, getTargetRotation } from '../lib/wheelGeometry';
import { getWheelColor, getWheelTextColor } from '../lib/colors';
import { pickWeightedIndex } from '../lib/weightedRandom';
import { splitWheelLabel } from '../lib/wheelText';
import type { WheelItem } from '../types/wheel';

const props = withDefaults(
  defineProps<{
    items: WheelItem[];
    emptyText: string;
    fullscreen?: boolean;
    spinDurationMs?: number;
    extraSpins?: number;
  }>(),
  {
    fullscreen: false,
    spinDurationMs: 6000,
    extraSpins: 10,
  },
);

const emit = defineEmits<{
  spinEnd: [item: WheelItem];
  spinStart: [];
}>();

// в”Ђв”Ђ РЎРѕСЃС‚РѕСЏРЅРёРµ в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
const spinning = ref(false);
const selectedId = ref<string | null>(null);

// РҐСЂР°РЅРёРј С‚РµРєСѓС‰РёР№ СѓРіРѕР» РєР°Рє РѕР±С‹С‡РЅСѓСЋ РїРµСЂРµРјРµРЅРЅСѓСЋ вЂ” РќР• СЂРµР°РєС‚РёРІРЅСѓСЋ,
// С‡С‚РѕР±С‹ РЅРµ С‚СЂРёРіРіРµСЂРёС‚СЊ Vue РїСЂРё РєР°Р¶РґРѕРј РєР°РґСЂРµ Р°РЅРёРјР°С†РёРё
let currentRotation = 0;

// Ref РЅР° SVG-РіСЂСѓРїРїСѓ, РєРѕС‚РѕСЂСѓСЋ Р±СѓРґРµРј РІСЂР°С‰Р°С‚СЊ РЅР°РїСЂСЏРјСѓСЋ
const rotorRef = ref<SVGGElement | null>(null);

// РџР°СЂР°РјРµС‚СЂС‹ Р°РЅРёРјР°С†РёРё вЂ” С‚РѕР¶Рµ РЅРµ СЂРµР°РєС‚РёРІРЅС‹Рµ
let animFrameId: number | null = null;
let animStart: number | null = null;
let animFrom = 0;
let animTo = 0;
let lastTickIndex = -1;

const segments = computed(() => buildWheelSegments(props.items));
const canSpin = computed(() => segments.value.length > 0 && !spinning.value);
const isSingleItem = computed(() => segments.value.length === 1);
const ticks = Array.from({ length: 24 }, (_, i) => i);

// в”Ђв”Ђ Easing в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
// РџР»Р°РІРЅР°СЏ РєСЂРёРІР°СЏ Р±РµР· СЂС‹РІРєРѕРІ: РєСѓР±РёС‡РµСЃРєРёР№ ease-out
// РљРѕРјР±РёРЅРёСЂРѕРІР°РЅРЅР°СЏ РєСЂРёРІР°СЏ: РјРіРЅРѕРІРµРЅРЅС‹Р№ СЃС‚Р°СЂС‚ + РґРѕР»РіРѕРµ Р·Р°С‚СѓС…Р°РЅРёРµ
function wheelEasing(t: number): number {
  // РСЃРїРѕР»СЊР·СѓРµРј СЃС‚РµРїРµРЅСЊ 4 РґР»СЏ Р±РѕР»РµРµ РІС‹СЂР°Р¶РµРЅРЅРѕРіРѕ Р·Р°РјРµРґР»РµРЅРёСЏ РІ РєРѕРЅС†Рµ
  return 1 - Math.pow(1 - t, 4);
}

// в”Ђв”Ђ РџСЂСЏРјРѕРµ РѕР±РЅРѕРІР»РµРЅРёРµ DOM в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
function setRotorRotation(degrees: number): void {
  if (rotorRef.value) {
    rotorRef.value.style.transform = `rotate(${degrees}deg)`;
  }
}

// в”Ђв”Ђ Р—РІСѓРє С‚РёРєР° в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
let audioCtx: AudioContext | null = null;

function playTick(): void {
  try {
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.04);
  } catch {
    // РЅРµ РєСЂРёС‚РёС‡РЅРѕ
  }
}

// в”Ђв”Ђ РљР°РєРѕР№ СЃРµРіРјРµРЅС‚ СЃРµР№С‡Р°СЃ РїРѕРґ СѓРєР°Р·Р°С‚РµР»РµРј в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
function getSegmentUnderPointer(deg: number): number {
  const count = segments.value.length;
  if (count === 0) return -1;
  const norm = ((deg % 360) + 360) % 360;
  return Math.floor(norm / (360 / count)) % count;
}

// в”Ђв”Ђ РџРѕРєР°РґСЂРѕРІР°СЏ Р°РЅРёРјР°С†РёСЏ в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
function frame(timestamp: number): void {
  if (animStart === null) {
    animStart = timestamp;
  }

  const elapsed = timestamp - animStart;
  const progress = Math.min(elapsed / props.spinDurationMs, 1);
  const eased = wheelEasing(progress);

  const deg = animFrom + (animTo - animFrom) * eased;

  // РќР°РїСЂСЏРјСѓСЋ СЃС‚Р°РІРёРј transform вЂ” Р±РµР· СЂРµР°РєС‚РёРІРЅРѕСЃС‚Рё Vue
  currentRotation = deg;
  setRotorRotation(deg);

  // РўРёРє РїСЂРё СЃРјРµРЅРµ СЃРµРіРјРµРЅС‚Р°
  const idx = getSegmentUnderPointer(deg);
  if (idx !== lastTickIndex && idx !== -1) {
    lastTickIndex = idx;
    playTick();
  }

  if (progress < 1) {
    animFrameId = requestAnimationFrame(frame);
  } else {
    // Р¤РёРЅР°Р»
    currentRotation = animTo;
    setRotorRotation(animTo);
    animFrameId = null;
    animStart = null;
    spinning.value = false;

    const winner = segments.value.find((s) => s.item.id === selectedId.value);
    if (winner) {
      emit('spinEnd', winner.item);
    }
  }
}

// в”Ђв”Ђ Р—Р°РїСѓСЃРє в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
function spin(): void {
  if (!canSpin.value) return;

  const segs = segments.value;
  const index = pickWeightedIndex(segs.map((s) => s.item.weight));
  if (index === null) return;

  const selected = segs[index];
  if (!selected) return;

  selectedId.value = selected.item.id;
  spinning.value = true;
  lastTickIndex = -1;

  emit('spinStart');

  animFrom = currentRotation;
  animTo = getTargetRotation(selected, currentRotation, props.extraSpins);
  animStart = null;

  // РРЅРёС†РёР°Р»РёР·РёСЂСѓРµРј AudioContext РїРѕ Р¶РµСЃС‚Сѓ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ (С‚СЂРµР±РѕРІР°РЅРёРµ Р±СЂР°СѓР·РµСЂРѕРІ)
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }

  animFrameId = requestAnimationFrame(frame);
}

// в”Ђв”Ђ РРЅРёС†РёР°Р»РёР·Р°С†РёСЏ РЅР°С‡Р°Р»СЊРЅРѕРіРѕ РїРѕР»РѕР¶РµРЅРёСЏ в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
onMounted(() => {
  setRotorRotation(currentRotation);
});

// в”Ђв”Ђ РћС‡РёСЃС‚РєР° в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
onBeforeUnmount(() => {
  if (animFrameId !== null) {
    cancelAnimationFrame(animFrameId);
  }
  if (audioCtx) {
    audioCtx.close();
    audioCtx = null;
  }
});

watch(
  () => props.items,
  () => {
    selectedId.value = null;
  },
);
</script>

<template>
  <div
    :class="[
      'flex flex-1 flex-col items-center justify-center',
      fullscreen
        ? 'fixed inset-0 z-40 p-4'
        : '',
    ]"
  >
    <div
      :class="[
        'relative aspect-square',
        fullscreen
          ? 'w-full max-w-[min(85vw,85vh,50rem)]'
          : 'w-full max-w-[min(74vw,25rem)] sm:max-w-[25rem]',
      ]"
    >
      <!-- РЈРєР°Р·Р°С‚РµР»СЊ -->
      <div
        class="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-2
               drop-shadow-[0_8px_0_rgba(0,0,0,0.18)]"
        :class="fullscreen ? 'h-16 w-16' : 'h-12 w-12'"
        aria-hidden="true"
      >
        <div
          :class="[
            'mx-auto h-0 w-0 border-l-transparent border-r-transparent border-t-[#ffe600]',
            fullscreen
              ? 'border-l-[24px] border-r-[24px] border-t-[50px]'
              : 'border-l-[18px] border-r-[18px] border-t-[38px]',
          ]"
        />
      </div>

      <!-- РљРѕР»РµСЃРѕ -->
      <div
        class="absolute inset-4 rounded-full bg-white p-3
               shadow-[0_18px_0_rgba(0,0,0,0.18),0_26px_60px_rgba(0,0,0,0.28)]"
      >
        <svg
          class="h-full w-full overflow-visible"
          viewBox="0 0 200 200"
          role="img"
          aria-label="Колесо рулетки"
        >
          <!--
            РљР»СЋС‡РµРІРѕРµ РёР·РјРµРЅРµРЅРёРµ: ref РЅР° <g>, СЃС‚РёР»СЊ Р·Р°РґР°С‘С‚СЃСЏ РЅР°РїСЂСЏРјСѓСЋ С‡РµСЂРµР· JS,
            РЅРёРєР°РєРѕРіРѕ CSS transition, РЅРёРєР°РєРѕР№ СЂРµР°РєС‚РёРІРЅРѕР№ РїСЂРёРІСЏР·РєРё :style
          -->
          <g
            ref="rotorRef"
            class="wheel-rotor"
            style="transform-origin: 100px 100px; will-change: transform"
          >
            <template v-if="segments.length > 0">
              <circle
                v-if="isSingleItem"
                cx="100"
                cy="100"
                r="96"
                :fill="getWheelColor(0)"
              />

              <template v-else>
                <g
                  v-for="(segment, index) in segments"
                  :key="segment.item.id"
                >
                  <path
                    :d="segment.path"
                    :fill="getWheelColor(index)"
                    :class="[
                      'stroke-white/80 transition-opacity duration-300',
                      selectedId === segment.item.id && spinning
                        ? 'opacity-100'
                        : 'opacity-95',
                    ]"
                    stroke-width="1.2"
                  />
                  <text
                    :x="segment.labelX"
                    :y="segment.labelY"
                    :transform="`rotate(${segment.labelRotation} ${segment.labelX} ${segment.labelY})`"
                    class="select-none text-[5.6px] font-black uppercase drop-shadow"
                    :fill="getWheelTextColor(index)"
                    dominant-baseline="middle"
                    text-anchor="middle"
                  >
                    <title>{{ segment.item.label }}</title>
                    <tspan
                      v-for="(line, lineIndex) in splitWheelLabel(segment.item.label, 9, 3)"
                      :key="`${segment.item.id}-${lineIndex}`"
                      :x="segment.labelX"
                      :dy="lineIndex === 0 ? -6.4 : 6.1"
                    >
                      {{ line }}
                    </tspan>
                  </text>
                </g>
              </template>

              <g opacity="0.7">
                <rect
                  v-for="tick in ticks"
                  :key="tick"
                  x="98.8"
                  y="9"
                  width="2.4"
                  height="11"
                  rx="1.2"
                  fill="white"
                  :transform="`rotate(${tick * 15} 100 100)`"
                />
              </g>

              <text
                v-if="isSingleItem"
                x="100"
                y="102"
                class="select-none text-[8px] font-black uppercase drop-shadow"
                :fill="getWheelTextColor(0)"
                dominant-baseline="middle"
                text-anchor="middle"
              >
                <title>{{ segments[0]?.item.label }}</title>
                <tspan
                  v-for="(line, lineIndex) in splitWheelLabel(
                    segments[0]?.item.label ?? '',
                    15,
                    3,
                  )"
                  :key="lineIndex"
                  x="100"
                  :dy="lineIndex === 0 ? -8 : 8"
                >
                  {{ line }}
                </tspan>
              </text>

              <circle cx="100" cy="100" r="17" fill="white" opacity="0.96" />
              <circle cx="100" cy="100" r="8" fill="#12162c" />
            </template>

            <template v-else>
              <circle cx="100" cy="100" r="96" fill="#2b2d48" />
              <circle
                cx="100"
                cy="100"
                r="72"
                fill="none"
                stroke="#ffe600"
                stroke-dasharray="6 8"
                stroke-width="2"
              />
              <text
                x="100"
                y="103"
                class="fill-white text-[10px] font-black uppercase"
                text-anchor="middle"
              >
                {{ props.emptyText }}
              </text>
            </template>
          </g>
        </svg>
      </div>
    </div>

    <!-- РљРЅРѕРїРєР° РєСЂСѓС‚РёС‚СЊ -->
    <button
      :class="[
        'inline-flex items-center justify-center rounded-full',
        'bg-[#ffe600] font-black uppercase text-[#12162c]',
        'shadow-[0_8px_0_#be8d00,0_20px_35px_rgba(0,0,0,0.2)]',
        'transition hover:-translate-y-0.5 hover:bg-white',
        'focus:outline-none focus:ring-4 focus:ring-white/70',
        'disabled:cursor-not-allowed disabled:translate-y-0',
        'disabled:bg-slate-400 disabled:text-slate-700 disabled:shadow-none',
        fullscreen
          ? 'mt-10 h-16 w-full max-w-[20rem] px-10 text-lg'
          : 'mt-8 h-14 w-full max-w-[16rem] px-8 text-base',
      ]"
      type="button"
      :disabled="!canSpin"
      @click="spin"
    >
      {{ spinning ? 'Крутим...' : 'Крутить' }}
    </button>
  </div>
</template>
