<template>
  <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
    <div class="mb-4">
      <h3 class="text-lg font-bold text-gray-800">Evolução da Satisfação</h3>
      <p class="text-xs text-gray-500">Média de avaliação ao longo do tempo</p>
    </div>
    
    <div class="flex-1 min-h-[250px]">
      <apexchart 
        v-if="hasData"
        type="area" 
        height="100%" 
        :options="chartOptions" 
        :series="series" 
      />
      <div v-else class="h-full flex items-center justify-center text-gray-500">
        <div class="text-center">
          <q-icon name="trending_flat" size="lg" class="mb-2 opacity-50" />
          <p>Dados insuficientes para gerar gráfico</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  }
});

const hasData = computed(() => props.data && props.data.length > 0);

const series = computed(() => [{
  name: 'Média de Satisfação',
  data: props.data.map(item => item.media)
}]);

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    zoom: { enabled: false },
    fontFamily: 'Inter, sans-serif'
  },
  colors: ['#2196F3'], // Primary blue
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.05,
      stops: [0, 100]
    }
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: 'smooth',
    width: 3
  },
  xaxis: {
    categories: props.data.map(item => {
      // Format to DD/MM
      const parts = item.data.split('-');
      if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
      return item.data;
    }),
    tooltip: { enabled: false },
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: { colors: '#9CA3AF' }
    }
  },
  yaxis: {
    min: 0,
    max: 5,
    tickAmount: 5,
    labels: {
      style: { colors: '#9CA3AF' }
    }
  },
  grid: {
    borderColor: '#F3F4F6',
    strokeDashArray: 4,
  },
  tooltip: {
    theme: 'light',
    y: {
      formatter: (val) => val.toFixed(1) + ' Estrelas'
    }
  }
}));
</script>
