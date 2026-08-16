<template>
  <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
    <div class="mb-4 flex justify-between items-center">
      <div>
        <h3 class="text-lg font-bold text-gray-800">Ranking de Serviços</h3>
        <p class="text-xs text-gray-500">Média de satisfação por serviço</p>
      </div>
      <q-icon name="emoji_events" size="sm" class="text-yellow-500" />
    </div>

    <div v-if="data && data.length > 0" class="space-y-3 mt-4">
      <div 
        v-for="(servico, index) in data" 
        :key="servico.id"
        class="flex items-center justify-between p-3 rounded-xl transition-colors"
        :class="index === 0 ? 'bg-yellow-50/50 border border-yellow-100' : 'hover:bg-gray-50 border border-transparent'"
      >
        <div class="flex items-center gap-3">
          <div 
            class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
            :class="[
              index === 0 ? 'bg-yellow-100 text-yellow-600' : 
              index === 1 ? 'bg-gray-200 text-gray-600' : 
              index === 2 ? 'bg-orange-100 text-orange-600' : 
              'bg-blue-50 text-blue-600'
            ]"
          >
            #{{ index + 1 }}
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-800">{{ servico.nome }}</p>
            <p class="text-xs text-gray-500">{{ servico.total }} avaliações</p>
          </div>
        </div>
        
        <div class="flex items-center gap-1">
          <span class="font-bold text-gray-800">{{ servico.media.toFixed(1) }}</span>
          <q-icon name="star" size="xs" :class="getStarColor(servico.media)" />
        </div>
      </div>
    </div>
    
    <div v-else class="py-8 flex flex-col items-center justify-center text-gray-400">
      <q-icon name="list_alt" size="lg" class="mb-2 opacity-50" />
      <p>Nenhum serviço avaliado no período</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  }
});

function getStarColor(media) {
  if (media >= 4) return 'text-green-500';
  if (media >= 3) return 'text-yellow-500';
  return 'text-red-500';
}
</script>
