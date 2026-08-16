<template>
  <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
    <div class="mb-4">
      <h3 class="text-lg font-bold text-gray-800">Principais Tópicos</h3>
      <p class="text-xs text-gray-500">O que os cidadãos mais comentam</p>
    </div>
    
    <div class="flex-1 min-h-[250px]">
      <apexchart 
        v-if="hasData"
        type="donut" 
        height="100%" 
        :options="chartOptions" 
        :series="series" 
      />
      <div v-else class="h-full flex items-center justify-center text-gray-400">
        <div class="text-center">
          <q-icon name="pie_chart" size="lg" class="mb-2 opacity-50" />
          <p>Sem dados de categorias</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  }
});

const hasData = computed(() => props.data && props.data.length > 0);

const series = computed(() => props.data.map(item => item.count));

const chartOptions = computed(() => ({
  chart: {
    type: 'donut',
    fontFamily: 'Inter, sans-serif'
  },
  labels: props.data.map(item => item.nome),
  colors: ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#6366F1', '#8B5CF6', '#EC4899'],
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        labels: {
          show: true,
          name: { show: true },
          value: { show: true }
        }
      }
    }
  },
  dataLabels: { enabled: false },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
    fontSize: '12px',
    markers: { radius: 12 }
  },
  stroke: { width: 0 }
}));
</script>
