<template>
  <q-page class="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto bg-gray-50/50">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
          <q-icon name="insights" class="text-primary" />
          Métricas e Feedbacks
        </h1>
        <p class="text-gray-500 mt-1">
          Acompanhe os indicadores de satisfação e as percepções dos cidadãos sobre os serviços municipais.
        </p>
      </div>

      <!-- Filtro de Período -->
      <div class="w-full md:w-auto">
        <q-select
          v-model="periodoSelecionado"
          :options="opcoesPeriodo"
          outlined
          dense
          options-dense
          emit-value
          map-options
          class="bg-white rounded-lg shadow-sm w-full md:w-48"
          @update:model-value="carregarDados"
        >
          <template v-slot:prepend>
            <q-icon name="calendar_today" size="xs" class="text-gray-400" />
          </template>
        </q-select>
      </div>
    </div>

    <!-- Estado de Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <q-spinner-dots color="primary" size="3em" />
      <p class="text-gray-500 mt-4 font-medium">Analisando dados...</p>
    </div>

    <!-- Conteúdo Principal -->
    <div v-else-if="metrics" class="space-y-6">
      <!-- 1. KPIs -->
      <FeedbackKpiCards :metrics="metrics" />

      <!-- 2. Gráficos Principais -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <SatisfactionChart :data="metrics.evolucao" />
        </div>
        <div>
          <RatingDistribution :data="metrics.distribuicao" />
        </div>
      </div>

      <!-- 3. Rankings e Insights -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <ServiceRanking :data="metrics.servicos" />
        </div>
        <div>
          <FeedbackCategories :data="metrics.categorias" />
        </div>
        <div>
          <FeedbackInsights :metrics="metrics" />
        </div>
      </div>

      <!-- 4. Feedbacks Recentes -->
      <div class="mt-8">
        <RecentFeedbacks :feedbacks="feedbacksRecentes" />
      </div>
    </div>

    <!-- Estado de Erro -->
    <div v-else class="flex flex-col items-center justify-center py-20 text-center">
      <q-icon name="error_outline" size="xl" class="text-red-400 mb-3" />
      <h3 class="text-lg font-bold text-gray-800">Falha ao carregar métricas</h3>
      <p class="text-gray-500 mt-1">Não foi possível conectar ao servidor de dados.</p>
      <q-btn color="primary" label="Tentar Novamente" class="mt-4 px-6 rounded-lg" unelevated @click="carregarDados" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { feedbackService } from 'src/services/feedbackService';

// Importação dos Componentes
import FeedbackKpiCards from 'src/components/feedback/FeedbackKpiCards.vue';
import SatisfactionChart from 'src/components/feedback/SatisfactionChart.vue';
import RatingDistribution from 'src/components/feedback/RatingDistribution.vue';
import ServiceRanking from 'src/components/feedback/ServiceRanking.vue';
import FeedbackCategories from 'src/components/feedback/FeedbackCategories.vue';
import FeedbackInsights from 'src/components/feedback/FeedbackInsights.vue';
import RecentFeedbacks from 'src/components/feedback/RecentFeedbacks.vue';

const $q = useQuasar();

// Filtros de Período
const periodoSelecionado = ref(30);
const opcoesPeriodo = [
  { label: 'Hoje', value: 1 },
  { label: 'Últimos 7 dias', value: 7 },
  { label: 'Últimos 30 dias', value: 30 },
  { label: 'Últimos 3 meses', value: 90 },
  { label: 'Todo o período', value: 0 }
];

// Estado
const loading = ref(true);
const metrics = ref(null);
const feedbacksRecentes = ref([]);

// Carregamento de Dados
async function carregarDados() {
  loading.value = true;
  try {
    const dias = periodoSelecionado.value > 0 ? periodoSelecionado.value : undefined;
    
    // Requisições paralelas para métricas e lista
    const [metricsData, recentesData] = await Promise.all([
      feedbackService.getMetrics(dias),
      feedbackService.getRecentes(dias, 10)
    ]);
    
    metrics.value = metricsData;
    feedbacksRecentes.value = recentesData;
  } catch (error) {
    console.error('Erro ao buscar dados de feedback:', error);
    $q.notify({
      type: 'negative',
      message: 'Não foi possível carregar os dados do dashboard.',
      position: 'top-right'
    });
    metrics.value = null;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  carregarDados();
});
</script>
