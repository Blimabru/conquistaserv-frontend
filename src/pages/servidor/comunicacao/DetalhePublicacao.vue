<template>
  <q-page class="bg-gray-50 pb-8">
    <CanaisAtalhos />
    <div class="mx-auto max-w-[780px] p-4">
      <q-btn
        flat
        no-caps
        dense
        color="primary"
        icon="arrow_back"
        label="Voltar"
        class="mb-2"
        @click="voltar"
      />

      
      <div v-if="carregando" class="flex flex-col flex-nowrap items-center py-16 text-gray-500">
        <q-spinner-dots color="primary" size="42px" />
        <div class="mt-2">Carregando publicação...</div>
      </div>

      
      <q-banner v-else-if="!publicacao" class="rounded-lg bg-red-50 text-negative">
        <template #avatar>
          <q-icon name="error_outline" color="negative" />
        </template>
        Publicação não encontrada.
      </q-banner>

      <!-- conteúdo -->
      <q-card v-else flat bordered class="rounded-lg">
        <q-card-section
          v-if="publicacao.midias && publicacao.midias.length"
          class="p-2"
        >
          <MidiaPublicacao
            :midias="publicacao.midias"
            modo="full"
            :alt="publicacao.titulo"
          />
        </q-card-section>

        <q-card-section>
          <div class="mb-2 flex flex-nowrap items-center gap-2">
            <q-chip
              dense
              :color="publicacao.canal.cor"
              text-color="white"
              :icon="publicacao.canal.icone"
              clickable
              @click="irParaCanal"
            >
              {{ publicacao.canal.nome }}
            </q-chip>
            <q-icon
              v-if="publicacao.canal.oficial"
              name="verified"
              color="primary"
              size="18px"
            >
              <q-tooltip>Canal oficial</q-tooltip>
            </q-icon>
          </div>

          <div class="text-2xl font-medium text-dark">
            {{ publicacao.titulo }}
          </div>

          <div class="mt-2 flex flex-nowrap items-center text-xs text-gray-600">
            <q-icon name="person" size="16px" class="mr-1" />
            <span>{{ publicacao.autor }}</span>
            <span class="mx-2">•</span>
            <q-icon name="schedule" size="16px" class="mr-1" />
            <span :title="dataCompleta">{{ dataRelativa(publicacao.dataPublicacao) }}</span>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <!-- corpo em HTML controlado (conteúdo institucional) -->
          <div class="corpo-publicacao text-[1.02rem] leading-relaxed text-gray-800" v-html="publicacao.corpo" />
        </q-card-section>

        <!-- reações -->
        <template v-if="publicacao.reacoesHabilitadas">
          <q-separator />
          <q-card-section>
            <ReacoesBar
              :reacoes="publicacao.reacoes"
              :minha-reacao="publicacao.minhaReacao"
              @reagir="onReagir"
              @remover="onRemover"
              @ver-reacoes="abrirQuemReagiu"
            />
          </q-card-section>
        </template>

        <!-- pesquisa de satisfação -->
        <q-card-section v-if="publicacao.pesquisa" class="pt-0">
          <PesquisaSatisfacao
            :publicacao-id="publicacao.id"
            :pesquisa="publicacao.pesquisa"
            @respondida="publicacao.pesquisa.jaRespondi = true"
          />
        </q-card-section>
      </q-card>
    </div>

    <QuemReagiuDialog
      v-model="quemReagiuAberto"
      :reacoes="listaReacoes"
      :carregando="carregandoReacoes"
    />
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ReacoesBar from 'src/components/comunicacao/ReacoesBar.vue';
import MidiaPublicacao from 'src/components/comunicacao/MidiaPublicacao.vue';
import QuemReagiuDialog from 'src/components/comunicacao/QuemReagiuDialog.vue';
import PesquisaSatisfacao from 'src/components/comunicacao/PesquisaSatisfacao.vue';
import CanaisAtalhos from 'src/components/comunicacao/CanaisAtalhos.vue';
import { dataRelativa, formatarData } from 'src/helpers/comunicacao/formatters';
import {
  buscarPublicacao,
  marcarLido,
  reagir,
  removerReacao,
  listarReacoes,
} from 'src/services/comunicacaoService';
import showNotification from 'src/utils/quasarPlugins/notifyMessage';

const route = useRoute();
const router = useRouter();

const publicacao = ref(null);
const carregando = ref(true);
const quemReagiuAberto = ref(false);
const listaReacoes = ref([]);
const carregandoReacoes = ref(false);

const dataCompleta = computed(() =>
  publicacao.value ? formatarData(publicacao.value.dataPublicacao) : '',
);

async function carregar() {
  carregando.value = true;
  try {
    const dados = await buscarPublicacao(route.params.id);
    publicacao.value = dados;
    if (dados && !dados.lido) {
      await marcarLido(dados.id);
      publicacao.value.lido = true;
    }
  } catch (e) {
    console.error('Erro ao carregar publicação:', e);
    publicacao.value = null;
  } finally {
    carregando.value = false;
  }
}

async function onReagir(tipo) {
  try {
    publicacao.value = await reagir(publicacao.value.id, tipo);
  } catch (e) {
    showNotification('negative', 'Não foi possível reagir.', 'top', 2500);
  }
}

async function onRemover() {
  try {
    publicacao.value = await removerReacao(publicacao.value.id);
  } catch (e) {
    showNotification('negative', 'Não foi possível remover a reação.', 'top', 2500);
  }
}

async function abrirQuemReagiu() {
  quemReagiuAberto.value = true;
  carregandoReacoes.value = true;
  try {
    listaReacoes.value = await listarReacoes(publicacao.value.id);
  } catch (e) {
    listaReacoes.value = [];
  } finally {
    carregandoReacoes.value = false;
  }
}

function irParaCanal() {
  router.push(`/comunicacao/canais/${publicacao.value.canal.id}`);
}
function voltar() {
  if (window.history.length > 1) router.back();
  else router.push('/comunicacao');
}

onMounted(carregar);
</script>

<style scoped>
.corpo-publicacao :deep(p) {
  margin-bottom: 0.9rem;
}
.corpo-publicacao :deep(ul) {
  margin: 0.5rem 0 0.9rem 1.2rem;
  list-style: disc;
}
.corpo-publicacao :deep(strong) {
  color: var(--q-dark);
}
</style>
