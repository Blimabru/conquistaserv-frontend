<template>
  <teleport to="body">
    <div v-if="store.active" class="fixed inset-0" style="z-index: 9995">
      <!-- Escurece a tela toda em volta do elemento em destaque, com o "buraco" arredondado
           acompanhando o border-radius do próprio elemento do spotlight (sem costuras nos cantos) -->
      <div
        v-if="rect"
        class="fixed rounded-2xl pointer-events-none transition-all duration-300 ease-out"
        :style="spotlightStyle"
      ></div>
      <div v-else class="fixed inset-0 bg-black/60 pointer-events-none"></div>

      <!-- Legenda do passo -->
      <div
        v-if="store.step"
        class="fixed bottom-8 left-8 max-w-[300px]"
        style="z-index: 9996"
      >
        <div class="flex flex-nowrap items-start justify-between gap-3">
          <h3 class="text-lg font-bold text-white">{{ store.step.title }}</h3>
          <button
            type="button"
            class="shrink-0 mt-1 text-xs font-medium text-white/60 hover:text-white cursor-pointer border-none bg-transparent"
            @click="handleSkip"
          >
            Pular
          </button>
        </div>
        <p class="mt-1 text-sm leading-relaxed text-white/70">{{ store.step.description }}</p>
      </div>

      <!-- Navegação entre passos -->
      <div
        class="fixed bottom-6 right-6 flex items-center gap-3 rounded-full bg-white px-3 py-2 shadow-2xl"
        style="z-index: 9996"
      >
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-full bg-[#045DA5] text-white transition-opacity disabled:opacity-30 cursor-pointer border-none"
          :disabled="store.isFirstStep"
          @click="handlePrev"
        >
          <q-icon name="chevron_left" size="20px" />
        </button>
        <span class="text-sm font-semibold text-gray-700 select-none">
          {{ store.currentStep + 1 }}/{{ store.total }}
        </span>
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-full bg-[#045DA5] text-white cursor-pointer border-none"
          @click="handleNext"
        >
          <q-icon :name="store.isLastStep ? 'done' : 'chevron_right'" size="20px" />
        </button>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useOnboardingStore } from 'src/stores/onboardingStore';

const PAD = 10;

const store = useOnboardingStore();
const router = useRouter();

const rect = ref(null);
let currentEl = null;
let rafId = null;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitForTarget(key, attempts = 40, delay = 60) {
  return new Promise((resolve) => {
    let tries = 0;
    const tick = () => {
      const el = document.querySelector(`[data-tour="${key}"]`);
      if (el) return resolve(el);
      tries += 1;
      if (tries >= attempts) return resolve(null);
      setTimeout(tick, delay);
    };
    tick();
  });
}

function computeRect() {
  if (!currentEl) {
    rect.value = null;
    return;
  }
  const r = currentEl.getBoundingClientRect();
  rect.value = { top: r.top, left: r.left, width: r.width, height: r.height };
}

async function locateCurrentStep() {
  currentEl = null;
  rect.value = null;

  const key = store.step?.target;
  if (!key) return;

  await nextTick();
  const el = await waitForTarget(key);
  if (!el || store.step?.target !== key) return;

  currentEl = el;
  el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  await wait(350);
  computeRect();
}

function scheduleRecompute() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(computeRect);
}

watch(
  () => (store.active ? store.currentStep : null),
  (step) => {
    if (step !== null) locateCurrentStep();
  },
  { immediate: true },
);

onMounted(() => {
  window.addEventListener('resize', scheduleRecompute);
  window.addEventListener('scroll', scheduleRecompute, true);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', scheduleRecompute);
  window.removeEventListener('scroll', scheduleRecompute, true);
  if (rafId) cancelAnimationFrame(rafId);
});

const spotlightStyle = computed(() => {
  if (!rect.value) return { display: 'none' };
  return {
    top: `${rect.value.top - PAD}px`,
    left: `${rect.value.left - PAD}px`,
    width: `${rect.value.width + PAD * 2}px`,
    height: `${rect.value.height + PAD * 2}px`,
    boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.65), 0 0 0 3px rgba(255, 255, 255, 0.9)',
  };
});

async function handleNext() {
  await store.next(router);
}

async function handlePrev() {
  await store.prev(router);
}

async function handleSkip() {
  await store.skip();
}
</script>
