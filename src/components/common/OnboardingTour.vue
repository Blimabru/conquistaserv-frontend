<template>
  <teleport to="body">
    <div v-if="store.active" class="tour-raiz">
      <!-- Escurece a tela em volta do elemento em destaque. O "buraco" arredondado
           acompanha o border-radius do próprio elemento (sem costuras nos cantos). -->
      <div
        v-if="rect"
        class="tour-spotlight"
        :style="spotlightStyle"
      ></div>
      <div v-else class="tour-veu"></div>

      <!-- Painel único: legenda + navegação juntas.
           Fica centralizado embaixo (ou em cima, se o destaque estiver na parte
           inferior da tela) para não colidir com o assistente Vitória, que ocupa
           o canto inferior direito. -->
      <div
        v-if="store.step"
        class="tour-painel"
        :class="painelEmCima ? 'tour-painel--topo' : 'tour-painel--base'"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-titulo"
        aria-describedby="tour-descricao"
        @keydown.esc="handleSkip"
      >
        <!-- Progresso: barra + contagem textual (não depende só da cor) -->
        <div class="tour-progresso" aria-hidden="true">
          <div class="tour-progresso__barra" :style="{ width: progressoPct + '%' }"></div>
        </div>

        <div class="tour-conteudo">
          <div class="tour-texto">
            <span class="tour-contador">Passo {{ store.currentStep + 1 }} de {{ store.total }}</span>
            <h2 id="tour-titulo" class="tour-titulo">{{ store.step.title }}</h2>
            <p id="tour-descricao" class="tour-descricao">{{ store.step.description }}</p>
          </div>

          <div class="tour-acoes">
            <button
              ref="botaoPular"
              type="button"
              class="tour-btn tour-btn--texto"
              @click="handleSkip"
            >
              Pular tour
            </button>

            <div class="tour-navegacao">
              <button
                type="button"
                class="tour-btn tour-btn--secundario"
                :disabled="store.isFirstStep"
                aria-label="Passo anterior"
                @click="handlePrev"
              >
                <q-icon name="chevron_left" size="20px" />
                <span class="tour-btn__rotulo">Voltar</span>
              </button>

              <button
                ref="botaoProximo"
                type="button"
                class="tour-btn tour-btn--primario"
                :aria-label="store.isLastStep ? 'Concluir tour' : 'Próximo passo'"
                @click="handleNext"
              >
                <span>{{ store.isLastStep ? 'Concluir' : 'Próximo' }}</span>
                <q-icon :name="store.isLastStep ? 'done' : 'chevron_right'" size="20px" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Anúncio da troca de passo para leitores de tela -->
      <span class="sr-only" aria-live="polite">
        Passo {{ store.currentStep + 1 }} de {{ store.total }}: {{ store.step?.title }}
      </span>
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
const larguraTela = ref(window.innerWidth);
const botaoProximo = ref(null);
let currentEl = null;
let rafId = null;

const ehMobile = computed(() => larguraTela.value < 640);

const progressoPct = computed(
  () => ((store.currentStep + 1) / store.total) * 100,
);

// O painel vai para o lado com mais espaço livre fora do elemento destacado,
// para cobrir o mínimo possível do que está sendo explicado. Quando o alvo é
// grande demais e sobra pouco dos dois lados, mantém embaixo (padrão).
const painelEmCima = computed(() => {
  if (!rect.value) return false;
  const espacoAcima = rect.value.top;
  const espacoAbaixo = window.innerHeight - (rect.value.top + rect.value.height);
  return espacoAcima > espacoAbaixo;
});

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
  // Respeita quem pediu menos movimento no sistema operacional.
  const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ block: 'center', behavior: suave ? 'smooth' : 'auto' });
  await wait(suave ? 350 : 60);
  computeRect();

  // Foco no botão de avançar: teclado começa já no controle mais usado.
  await nextTick();
  botaoProximo.value?.focus({ preventScroll: true });
}

function scheduleRecompute() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    larguraTela.value = window.innerWidth;
    computeRect();
  });
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
  const pad = ehMobile.value ? 6 : PAD;
  return {
    top: `${rect.value.top - pad}px`,
    left: `${rect.value.left - pad}px`,
    width: `${rect.value.width + pad * 2}px`,
    height: `${rect.value.height + pad * 2}px`,
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

<style scoped lang="scss">
/* Acima do assistente Vitória, que usa z-index 9999 (botão) e 10000 (janela). */
$z-tour: 10050;

/* Captura todos os cliques enquanto o tour está ativo: sem isso um clique fora
   do painel atinge a página por baixo e tira o usuário do meio do tour. */
.tour-raiz {
  position: fixed;
  inset: 0;
  z-index: $z-tour;
  pointer-events: auto;
}

.tour-veu {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
}

.tour-spotlight {
  position: fixed;
  border-radius: 16px;
  box-shadow:
    0 0 0 9999px rgba(15, 23, 42, 0.65),
    0 0 0 3px rgba(255, 255, 255, 0.9);
  transition: top 0.3s ease-out, left 0.3s ease-out, width 0.3s ease-out,
    height 0.3s ease-out;
}

/* ─── Painel ─────────────────────────────────────────────────────── */

.tour-painel {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  width: min(560px, calc(100vw - 32px));
  background: #ffffff;
  border-radius: 18px;
  box-shadow:
    0 18px 50px -12px rgba(15, 23, 42, 0.45),
    0 0 0 1px rgba(15, 23, 42, 0.06);
  overflow: hidden;
  animation: tour-entra 0.28s ease-out;
}

.tour-painel--base { bottom: 28px; }
.tour-painel--topo { top: 28px; }

@keyframes tour-entra {
  from { opacity: 0; transform: translateX(-50%) translateY(8px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}

.tour-progresso {
  height: 4px;
  background: #e8eef4;
}

.tour-progresso__barra {
  height: 100%;
  background: #045da5;
  border-radius: 0 4px 4px 0;
  transition: width 0.3s ease-out;
}

.tour-conteudo {
  padding: 20px 22px 18px;
}

.tour-contador {
  display: block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #045da5;
  margin-bottom: 6px;
}

.tour-titulo {
  margin: 0;
  font-size: 18px;
  line-height: 1.25;
  font-weight: 700;
  color: #0f1a24;
}

.tour-descricao {
  margin: 6px 0 0;
  font-size: 14px;
  line-height: 1.55;
  color: #4a5866;
}

.tour-acoes {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 18px;
}

.tour-navegacao {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ─── Botões (alvo mínimo de 44px, WCAG 2.5.8) ───────────────────── */

.tour-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 44px;
  padding: 0 16px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.tour-btn--primario {
  background: #045da5;
  color: #ffffff;
  padding-right: 12px;

  &:hover { background: #024881; }
}

.tour-btn--secundario {
  background: #f1f5f9;
  color: #334155;
  padding-left: 10px;

  &:hover:not(:disabled) { background: #e2e8f0; }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
}

.tour-btn--texto {
  background: transparent;
  color: #64748b;
  padding: 0 8px;

  &:hover { color: #0f1a24; }
}

.tour-btn:focus-visible {
  outline: 3px solid #045da5;
  outline-offset: 2px;
}

.tour-btn--primario:focus-visible {
  outline-color: #0f1a24;
}

/* ─── Celular ────────────────────────────────────────────────────── */

@media (max-width: 640px) {
  .tour-painel {
    width: calc(100vw - 20px);
    border-radius: 16px;
  }

  .tour-painel--base { bottom: 12px; }
  .tour-painel--topo { top: 12px; }

  .tour-conteudo { padding: 16px 16px 14px; }

  .tour-titulo { font-size: 16px; }
  .tour-descricao { font-size: 13.5px; }

  /* Ações empilhadas: navegação em cima, ocupando a linha toda */
  .tour-acoes {
    flex-direction: column-reverse;
    align-items: stretch;
    gap: 8px;
    margin-top: 14px;
  }

  .tour-navegacao { width: 100%; }

  .tour-btn--primario { flex: 1 1 auto; }
  .tour-btn--secundario { flex: 0 0 auto; }
  .tour-btn--texto { width: 100%; min-height: 40px; }

  /* Em telas estreitas o rótulo "Voltar" sai; fica só a seta */
  .tour-btn__rotulo { display: none; }
  .tour-btn--secundario { padding: 0 12px; }
}

@media (prefers-reduced-motion: reduce) {
  .tour-painel { animation: none; }
  .tour-spotlight,
  .tour-progresso__barra { transition: none; }
}
</style>
