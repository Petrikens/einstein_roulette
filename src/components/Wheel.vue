<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { getWheelColor, getWheelTextColor } from '../lib/colors';
import { pickWeightedIndex } from '../lib/weightedRandom';
import { buildWheelSegments, getTargetRotation } from '../lib/wheelGeometry';
import { splitWheelLabel } from '../lib/wheelText';
import type { WheelItem } from '../types/wheel';

const uiText = {
  wheelAriaLabel: '\u041a\u043e\u043b\u0435\u0441\u043e \u0440\u0443\u043b\u0435\u0442\u043a\u0438',
};

const props = withDefaults(
  defineProps<{
    items: WheelItem[];
    emptyText: string;
    fullscreen?: boolean;
    spinDurationMs?: number;
    extraSpins?: number;
    shortcutEnabled?: boolean;
  }>(),
  {
    fullscreen: false,
    spinDurationMs: 6000,
    extraSpins: 10,
    shortcutEnabled: true,
  },
);

const emit = defineEmits<{
  spinEnd: [item: WheelItem];
  spinStart: [];
}>();

const spinning = ref(false);
const selectedId = ref<string | null>(null);
const rotorRef = ref<SVGGElement | null>(null);

let currentRotation = 0;
let animFrameId: number | null = null;
let animStart: number | null = null;
let animFrom = 0;
let animTo = 0;
let lastTickIndex = -1;
let audioCtx: AudioContext | null = null;

const segments = computed(() => buildWheelSegments(props.items));
const canSpin = computed(() => segments.value.length > 0 && !spinning.value);
const isSingleItem = computed(() => segments.value.length === 1);
const ticks = Array.from({ length: 24 }, (_, index) => index);

function wheelEasing(progress: number): number {
  return 1 - Math.pow(1 - progress, 4);
}

function setRotorRotation(degrees: number): void {
  if (rotorRef.value) {
    rotorRef.value.style.transform = `rotate(${degrees}deg)`;
  }
}

function playTick(): void {
  try {
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }

    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    oscillator.connect(gain);
    gain.connect(audioCtx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1800, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.04);
  } catch {
    // Audio feedback is optional.
  }
}

function getSegmentUnderPointer(degrees: number): number {
  const count = segments.value.length;

  if (count === 0) {
    return -1;
  }

  const normalized = ((degrees % 360) + 360) % 360;
  return Math.floor(normalized / (360 / count)) % count;
}

function getWheelDisplayLabel(item: WheelItem): string {
  const compact = item.wheelLabel?.trim();

  return compact && compact.length > 0 ? compact : item.label;
}

function isCompactWheelLabel(item: WheelItem): boolean {
  return getWheelDisplayLabel(item).length <= 3;
}

function getWheelLabelLines(item: WheelItem, maxLineLength: number, maxLines: number): string[] {
  return splitWheelLabel(getWheelDisplayLabel(item), maxLineLength, maxLines);
}

function frame(timestamp: number): void {
  if (animStart === null) {
    animStart = timestamp;
  }

  const elapsed = timestamp - animStart;
  const progress = Math.min(elapsed / props.spinDurationMs, 1);
  const eased = wheelEasing(progress);
  const degrees = animFrom + (animTo - animFrom) * eased;

  currentRotation = degrees;
  setRotorRotation(degrees);

  const index = getSegmentUnderPointer(degrees);
  if (index !== lastTickIndex && index !== -1) {
    lastTickIndex = index;
    playTick();
  }

  if (progress < 1) {
    animFrameId = requestAnimationFrame(frame);
    return;
  }

  currentRotation = animTo;
  setRotorRotation(animTo);
  animFrameId = null;
  animStart = null;
  spinning.value = false;

  const winner = segments.value.find((segment) => segment.item.id === selectedId.value);
  if (winner) {
    emit('spinEnd', winner.item);
  }
}

function spin(): void {
  if (!canSpin.value) {
    return;
  }

  const index = pickWeightedIndex(segments.value.map((segment) => segment.item.weight));
  if (index === null) {
    return;
  }

  const selected = segments.value[index];
  if (!selected) {
    return;
  }

  selectedId.value = selected.item.id;
  spinning.value = true;
  lastTickIndex = -1;

  emit('spinStart');

  animFrom = currentRotation;
  animTo = getTargetRotation(selected, currentRotation, props.extraSpins);
  animStart = null;

  if (!audioCtx) {
    audioCtx = new AudioContext();
  }

  animFrameId = requestAnimationFrame(frame);
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return target.closest('input, textarea, select, button, [contenteditable="true"]') !== null;
}

function handleWindowKeydown(event: KeyboardEvent): void {
  if (
    !props.shortcutEnabled
    || event.defaultPrevented
    || event.code !== 'Space'
    || event.repeat
    || event.altKey
    || event.ctrlKey
    || event.metaKey
    || isInteractiveTarget(event.target)
  ) {
    return;
  }

  event.preventDefault();
  spin();
}

onMounted(() => {
  setRotorRotation(currentRotation);
  window.addEventListener('keydown', handleWindowKeydown);
});

onBeforeUnmount(() => {
  if (animFrameId !== null) {
    cancelAnimationFrame(animFrameId);
  }

  window.removeEventListener('keydown', handleWindowKeydown);

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
      fullscreen ? 'fixed inset-0 z-40 px-3 py-3 sm:px-5 sm:py-5' : '',
    ]"
  >
    <div
      :class="[
        'relative aspect-square',
        fullscreen
          ? 'w-full max-w-[min(96vw,89vh,68rem)]'
          : 'w-full max-w-[min(82vw,34rem)] sm:max-w-[34rem]',
      ]"
    >
      <div
        class="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-2 drop-shadow-[0_8px_0_rgba(0,0,0,0.18)]"
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

      <div
        class="absolute inset-2 rounded-full bg-white p-2.5 shadow-[0_18px_0_rgba(0,0,0,0.18),0_26px_60px_rgba(0,0,0,0.28)] sm:inset-3 sm:p-3"
      >
        <svg
          class="h-full w-full overflow-visible"
          viewBox="0 0 200 200"
          role="img"
          :aria-label="uiText.wheelAriaLabel"
        >
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
                      selectedId === segment.item.id && spinning ? 'opacity-100' : 'opacity-95',
                    ]"
                    stroke-width="1.2"
                  />
                  <text
                    :x="segment.labelX"
                    :y="segment.labelY"
                    :transform="`rotate(${segment.labelRotation} ${segment.labelX} ${segment.labelY})`"
                    class="select-none font-black uppercase drop-shadow"
                    :class="isCompactWheelLabel(segment.item) ? 'text-[10px]' : 'text-[5.6px]'"
                    :fill="getWheelTextColor(index)"
                    dominant-baseline="middle"
                    text-anchor="middle"
                  >
                    <title>{{ segment.item.label }}</title>
                    <template v-if="isCompactWheelLabel(segment.item)">
                      <tspan :x="segment.labelX" dy="0">{{ getWheelDisplayLabel(segment.item) }}</tspan>
                    </template>
                    <template v-else>
                      <tspan
                        v-for="(line, lineIndex) in getWheelLabelLines(segment.item, 9, 3)"
                        :key="`${segment.item.id}-${lineIndex}`"
                        :x="segment.labelX"
                        :dy="lineIndex === 0 ? -6.4 : 6.1"
                      >
                        {{ line }}
                      </tspan>
                    </template>
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
                class="select-none font-black uppercase drop-shadow"
                :class="isCompactWheelLabel(segments[0]?.item) ? 'text-[18px]' : 'text-[8px]'"
                :fill="getWheelTextColor(0)"
                dominant-baseline="middle"
                text-anchor="middle"
              >
                <title>{{ segments[0]?.item.label }}</title>
                <template v-if="segments[0] && isCompactWheelLabel(segments[0].item)">
                  <tspan x="100" dy="0">{{ getWheelDisplayLabel(segments[0].item) }}</tspan>
                </template>
                <template v-else>
                  <tspan
                    v-for="(line, lineIndex) in getWheelLabelLines(segments[0]?.item ?? { id: '', label: '', weight: 1 }, 15, 3)"
                    :key="lineIndex"
                    x="100"
                    :dy="lineIndex === 0 ? -8 : 8"
                  >
                    {{ line }}
                  </tspan>
                </template>
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
  </div>
</template>
