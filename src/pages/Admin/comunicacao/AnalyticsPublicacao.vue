<template>
  <q-page class="p-4">
    <PageCard icon="insert_chart" title="Desempenho da Publicação">
      <div v-if="loading" class="flex justify-center p-10">
        <q-spinner color="primary" size="3em" />
      </div>

      <div v-else-if="metrics" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-1 rounded-lg border border-primary-light bg-primary-light p-4 text-center">
          <div class="text-3xl font-bold text-primary">{{ metrics.totalLeituras }}</div>
          <div class="text-sm text-gray-600">Total de Leituras</div>
        </div>

        <q-card bordered flat class="md:col-span-2">
          <q-card-section>
            <div class="text-base font-medium text-gray-800">Reações</div>
          </q-card-section>
          <q-card-section class="flex flex-wrap gap-6 justify-center">
            <div v-for="(count, tipo) in metrics.reacoes" :key="tipo" class="text-center">
              <q-avatar size="xl" :color="corReacao(tipo)" text-color="white" :icon="iconeReacao(tipo)" />
              <div class="text-lg font-semibold mt-2">{{ count }}</div>
              <div class="text-xs text-gray-500 capitalize">{{ labelReacao(tipo) }}</div>
            </div>
            <div v-if="!Object.keys(metrics.reacoes).length" class="text-gray-500 italic">
              Nenhuma reação registrada ainda.
            </div>
          </q-card-section>
        </q-card>

        <q-card v-if="metrics.pesquisa" bordered flat class="md:col-span-3">
          <q-card-section class="bg-gray-50">
            <div class="text-base font-medium text-gray-800">Pesquisa: "{{ metrics.pesquisa.pergunta }}"</div>
            <div class="text-sm text-gray-500">
              {{ metrics.pesquisa.totalRespostas }} respostas · Média: {{ Number(metrics.pesquisa.mediaNota).toFixed(1) }} / 5
            </div>
          </q-card-section>

          <q-separator />

          <q-list separator>
            <q-item v-for="(resp, i) in metrics.pesquisa.respostas" :key="i">
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">{{ resp.nota }}</q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ resp.comentario || '(Sem comentário)' }}</q-item-label>
                <q-item-label caption>{{ resp.usuario }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </PageCard>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import PageCard from 'components/common/PageCard.vue';
import { analyticsPublicacao } from 'src/services/comunicacao/publicacoesAdminService';
import { MAPA_REACAO } from 'src/helpers/comunicacao/reacoes';

const route = useRoute();
const loading = ref(true);
const metrics = ref(null);

function iconeReacao(tipo) { return MAPA_REACAO[tipo]?.icone || 'thumb_up'; }
function corReacao(tipo) { return MAPA_REACAO[tipo]?.cor || 'grey'; }
function labelReacao(tipo) { return MAPA_REACAO[tipo]?.label || tipo; }

onMounted(async () => {
  try {
    metrics.value = await analyticsPublicacao(route.params.id);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>
