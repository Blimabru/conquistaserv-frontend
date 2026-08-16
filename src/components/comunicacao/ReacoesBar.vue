<template>
  <div class="flex flex-nowrap items-center gap-4 w-full">

    <!-- Abre no hover (mouse), no foco (teclado) e num toque longo/clique no botão
         "Escolher reação" (touch), já que dispositivos de toque não têm :hover. -->
    <div
      class="relative inline-block"
      @mouseenter="abrirSeletor"
      @mouseleave="fecharSeletor"
      @focusin="abrirSeletor"
      @focusout="aoSairFoco"
      @keydown.esc="fecharSeletorEVoltarFoco"
    >
      <div
        v-show="seletorAberto"
        class="absolute bottom-full left-0 pb-2 z-30"
        role="group"
        aria-label="Escolha uma reação"
      >
        <div class="flex flex-nowrap items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100">
          <button
            v-for="r in tipos"
            :key="r.tipo"
            ref="botoesReacao"
            type="button"
            class="group/btn flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-125"
            :aria-label="r.label"
            :aria-pressed="minhaReacao === r.tipo"
            @click.stop="escolher(r.tipo)"
          >
            <q-icon
              :name="r.icone"
              size="20px"
              :color="r.cor"
              class="transition-transform duration-100 group-hover/btn:scale-125"
            />
          </button>

          <button
            v-if="minhaReacao"
            type="button"
            class="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-red-500 ml-1"
            aria-label="Remover minha reação"
            @click.stop="remover"
          >
            <q-icon name="close" size="16px" />
          </button>
        </div>
      </div>

      <div class="flex items-center">
        <!-- Ação principal: curtir / remover -->
        <button
          ref="botaoPrincipal"
          type="button"
          class="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
          :class="minhaDef ? 'text-primary bg-primary/10 hover:bg-primary/20' : 'text-gray-600 hover:bg-gray-100'"
          :aria-pressed="!!minhaReacao"
          :aria-label="minhaDef ? `Sua reação: ${minhaDef.label}. Ativar para remover.` : 'Curtir'"
          @click="cliquePadrao"
        >
          <q-icon
            :name="minhaDef ? minhaDef.icone : 'thumb_up'"
            size="18px"
            :color="minhaDef ? minhaDef.cor : ''"
          />
          <span>{{ minhaDef ? minhaDef.label : 'Curtir' }}</span>
        </button>

        <!-- Alternativa explícita para teclado e toque, onde não existe :hover -->
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Escolher outra reação"
          :aria-expanded="seletorAberto"
          @click.stop="alternarSeletor"
        >
          <q-icon name="add_reaction" size="18px" />
        </button>
      </div>
    </div>

    <div v-if="total > 0" class="flex items-center text-xs text-gray-500">
      <button
        type="button"
        class="flex items-center gap-1 hover:underline cursor-pointer"
        :aria-label="`Ver quem reagiu (${total} ${total === 1 ? 'reação' : 'reações'})`"
        @click="$emit('ver-reacoes')"
      >
        <div class="inline-flex" aria-hidden="true">
          <span
            v-for="r in presentes"
            :key="r.tipo"
            class="-ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[13px] first:ml-0 shadow-sm border border-white"
          >
            <q-icon :name="r.icone" size="13px" :color="r.cor" />
          </span>
        </div>
        <span class="font-medium text-gray-600 ml-1">{{ total }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue';
import {
  TIPOS_REACAO,
  MAPA_REACAO,
  reacoesPresentes,
  totalReacoes,
} from 'src/helpers/comunicacao/reacoes';

const props = defineProps({
  reacoes: { type: Object, default: () => ({}) },
  minhaReacao: { type: String, default: null },
});

const emit = defineEmits(['reagir', 'remover', 'ver-reacoes']);

const tipos = TIPOS_REACAO;
const seletorAberto = ref(false);
const botoesReacao = ref([]);
const botaoPrincipal = ref(null);

const total = computed(() => totalReacoes(props.reacoes));
const presentes = computed(() => reacoesPresentes(props.reacoes).slice(0, 5));
const minhaDef = computed(() =>
  props.minhaReacao ? MAPA_REACAO[props.minhaReacao] : null,
);

function abrirSeletor() {
  seletorAberto.value = true;
}

function fecharSeletor() {
  seletorAberto.value = false;
}

// Só fecha se o foco saiu de vez do bloco — senão fecharia ao tabular entre as reações.
function aoSairFoco(evento) {
  if (!evento.currentTarget.contains(evento.relatedTarget)) {
    seletorAberto.value = false;
  }
}

function fecharSeletorEVoltarFoco() {
  seletorAberto.value = false;
  botaoPrincipal.value?.focus();
}

async function alternarSeletor() {
  seletorAberto.value = !seletorAberto.value;
  if (seletorAberto.value) {
    await nextTick();
    botoesReacao.value[0]?.focus();
  }
}

function cliquePadrao() {
  if (props.minhaReacao) {
    emit('remover');
  } else {
    emit('reagir', 'curtir');
  }
}

function escolher(tipo) {
  if (tipo === props.minhaReacao) {
    emit('remover');
  } else {
    emit('reagir', tipo);
  }
  fecharSeletor();
}

function remover() {
  emit('remover');
  fecharSeletor();
}
</script>
