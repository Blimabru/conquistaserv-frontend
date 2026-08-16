<template>
  <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
    <div class="mb-4">
      <h3 class="text-lg font-bold text-gray-800">Distribuição de Avaliações</h3>
      <p class="text-xs text-gray-500">Quantidade de feedbacks por nota</p>
    </div>
    
    <div class="flex-1 min-h-[250px]">
      <apexchart 
        v-if="hasData"
        type="bar" 
        height="100%" 
        :options="chartOptions" 
        :series="series" 
      />
      <div v-else class="h-full flex items-center justify-center text-gray-500">
        <div class="text-center">
          <q-icon name="bar_chart" size="lg" class="mb-2 opacity-50" />
          <p>Dados insuficientes</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
  }
});

const hasData = computed(() => {
  return Object.values(props.data).some(v => v > 0);
});

const series = computed(() => [{
  name: 'Avaliações',
  data: [
    props.data['5'] || 0,
    props.data['4'] || 0,
    props.data['3'] || 0,
    props.data['2'] || 0,
    props.data['1'] || 0
  ]
}]);

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: 'Inter, sans-serif'
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 4,
      barHeight: '60%',
      distributed: true
    }
  },
  colors: [
    '#22C55E', // 5 stars (green)
    '#84CC16', // 4 stars (light green)
    '#EAB308', // 3 stars (yellow)
    '#F97316', // 2 stars (orange)
    '#EF4444'  // 1 star (red)
  ],
  dataLabels: {
    enabled: true,
    textAnchor: 'start',
    style: {
      colors: ['#fff']
    },
    formatter: function (val, opt) {
      return val > 0 ? val : ''
    },
    offsetX: 0,
  },
  legend: { show: false },
  xaxis: {
    categories: ['5 Estrelas', '4 Estrelas', '3 Estrelas', '2 Estrelas', '1 Estrela'],
    labels: { show: false },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: {
      style: {
        colors: '#4B5563',
        fontWeight: 500
      }
    }
  },
  grid: { show: false },
  tooltip: {
    theme: 'light',
    y: {
      title: { formatter: () => 'Total:' }
    }
  }
}));
</script>
