<template>
  <q-card
    ref="cardRef"
    flat
    bordered
    class="mb-4 overflow-visible rounded-2xl bg-white shadow-sm transition-all duration-150"
    role="article"
    :aria-label="`Publicação: ${publicacao.titulo}`"
  >
    
    <q-card-section class="flex flex-nowrap items-center pb-2">
      <q-avatar
        :color="publicacao.canal.cor"
        text-color="white"
        :icon="publicacao.canal.icone"
        size="40px"
      />
      <div class="ml-3 grow">
        <div class="flex flex-nowrap items-center gap-1">
          <span class="font-medium text-dark">{{ publicacao.canal.nome }}</span>

        </div>
        <div class="text-xs text-gray-500">
          {{ publicacao.autor }} • {{ dataRelativa(publicacao.dataPublicacao) }}
        </div>
      </div>
    </q-card-section>

    
    <MidiaPublicacao
      v-if="publicacao.midias && publicacao.midias.length"
      :midias="publicacao.midias"
      modo="preview"
      :alt="publicacao.titulo"
    />

    
    <q-card-section class="py-2">
      <div class="text-lg font-medium leading-tight text-dark mb-1">
        {{ publicacao.titulo }}
      </div>

      <div
        class="text-sm text-gray-700 leading-relaxed transition-all"
        :class="!expandido && 'line-clamp-3'"
        v-html="publicacao.corpo || publicacao.resumo"
      />

      <button
        v-if="temTextoLongo"
        type="button"
        class="mt-1 text-[0.9rem] text-gray-500 bg-transparent border-none p-0 hover:text-gray-800 hover:underline focus:outline-none cursor-pointer"
        @click="expandido = !expandido"
      >
        {{ expandido ? 'Ver menos' : 'Ver mais' }}
      </button>
    </q-card-section>

    
    <q-card-section v-if="publicacao.pesquisa && mostrarPesquisa && !pesquisaFechada" class="pt-0 pb-2">
      <PesquisaSatisfacao
        :publicacao-id="pub.id"
        :pesquisa="pub.pesquisa"
        @respondida="pub.pesquisa.jaRespondi = true"
        @fechar="pesquisaFechada = true"
      />
    </q-card-section>

    <q-separator inset />

    
    <q-card-section v-if="publicacao.reacoesHabilitadas" class="flex flex-nowrap items-center py-2">
      <ReacoesBar
        :reacoes="pub.reacoes"
        :minha-reacao="pub.minhaReacao"
        @reagir="onReagir"
        @remover="onRemover"
        @ver-reacoes="abrirQuemReagiu"
      />
    </q-card-section>

    
    <QuemReagiuDialog
      v-model="quemReagiuAberto"
      :reacoes="listaReacoes"
      :carregando="carregandoReacoes"
    />
  </q-card>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import MidiaPublicacao from './MidiaPublicacao.vue';
import ReacoesBar from './ReacoesBar.vue';
import QuemReagiuDialog from './QuemReagiuDialog.vue';
import PesquisaSatisfacao from './PesquisaSatisfacao.vue';
import { dataRelativa } from 'src/helpers/comunicacao/formatters';
import {
  marcarLido,
  reagir,
  removerReacao,
  listarReacoes,
} from 'src/services/comunicacaoService';
import showNotification from 'src/utils/quasarPlugins/notifyMessage';

const props = defineProps({
  publicacao: {
    type: Object,
    required: true,
  },
});

const pub = ref(props.publicacao);
const expandido = ref(false);
const mostrarPesquisa = ref(false);
const pesquisaFechada = ref(false);
const cardRef = ref(null);
const quemReagiuAberto = ref(false);
const listaReacoes = ref([]);
const carregandoReacoes = ref(false);

let timerPesquisa = null;
let observer = null;

const temTextoLongo = computed(() => {
  const texto = pub.value.corpo || pub.value.resumo || '';
  return texto.length > 180;
});

async function onReagir(tipo) {
  try {
    const atualizado = await reagir(pub.value.id, tipo);
    pub.value = atualizado;
  } catch (e) {
    showNotification('negative', 'Não foi possível reagir.', 'top', 2500);
  }
}

async function onRemover() {
  try {
    const atualizado = await removerReacao(pub.value.id);
    pub.value = atualizado;
  } catch (e) {
    showNotification('negative', 'Não foi possível remover a reação.', 'top', 2500);
  }
}

async function abrirQuemReagiu() {
  quemReagiuAberto.value = true;
  carregandoReacoes.value = true;
  try {
    listaReacoes.value = await listarReacoes(pub.value.id);
  } catch (e) {
    listaReacoes.value = [];
  } finally {
    carregandoReacoes.value = false;
  }
}

onMounted(() => {
  const el = cardRef.value?.$el || cardRef.value;
  if (!el) return;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!pub.value.lido) {
            marcarLido(pub.value.id).then(() => {
              pub.value.lido = true;
            });
          }

          if (!timerPesquisa && pub.value.pesquisa && !mostrarPesquisa.value) {
            timerPesquisa = setTimeout(() => {
              mostrarPesquisa.value = true;
            }, 3000);
          }
        } else {
          if (timerPesquisa) {
            clearTimeout(timerPesquisa);
            timerPesquisa = null;
          }
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(el);
});

onUnmounted(() => {
  if (timerPesquisa) clearTimeout(timerPesquisa);
  if (observer) observer.disconnect();
});
</script>
