<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <!-- Total Feedbacks -->
    <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-sm font-medium text-gray-500">Total de Feedbacks</h3>
        <q-icon name="chat_bubble_outline" size="xs" class="text-primary bg-blue-50 p-1.5 rounded-lg" />
      </div>
      <div class="text-2xl font-bold text-gray-800">{{ metrics.total || 0 }}</div>
      <p class="text-xs text-gray-400 mt-1">No período selecionado</p>
    </div>

    <!-- Média de Satisfação -->
    <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-sm font-medium text-gray-500">Média Geral</h3>
        <q-icon name="star_outline" size="xs" class="text-yellow-500 bg-yellow-50 p-1.5 rounded-lg" />
      </div>
      <div class="text-2xl font-bold text-gray-800 flex items-baseline gap-1">
        {{ metrics.media || '0.0' }}
        <span class="text-sm font-medium text-gray-400">/ 5.0</span>
      </div>
      <p class="text-xs text-gray-400 mt-1">Satisfação dos cidadãos</p>
    </div>

    <!-- % Positivas -->
    <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-sm font-medium text-gray-500">Avaliações Positivas</h3>
        <q-icon name="thumb_up_alt" size="xs" class="text-green-500 bg-green-50 p-1.5 rounded-lg" />
      </div>
      <div class="text-2xl font-bold text-gray-800">{{ metrics.positivasPct || 0 }}%</div>
      <p class="text-xs text-green-600 mt-1 font-medium flex items-center gap-1">
        <q-icon name="check_circle" size="12px" />
        Notas 4 e 5
      </p>
    </div>

    <!-- % Negativas -->
    <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-sm font-medium text-gray-500">Avaliações Negativas</h3>
        <q-icon name="thumb_down_alt" size="xs" class="text-red-500 bg-red-50 p-1.5 rounded-lg" />
      </div>
      <div class="text-2xl font-bold text-gray-800">{{ metrics.negativasPct || 0 }}%</div>
      <p class="text-xs text-red-500 mt-1 font-medium flex items-center gap-1">
        <q-icon name="warning" size="12px" />
        Notas 1 a 3
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  metrics: {
    type: Object,
    required: true,
    default: () => ({})
  }
})
</script>
