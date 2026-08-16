<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="p-5 border-b border-gray-100">
      <h3 class="text-lg font-bold text-gray-800">Feedbacks Recentes</h3>
      <p class="text-xs text-gray-500">Últimas avaliações recebidas</p>
    </div>

    <div v-if="feedbacks.length > 0">
      <div 
        v-for="feedback in feedbacks" 
        :key="feedback.id"
        class="p-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors last:border-0"
      >
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-gray-800">{{ feedback.servico?.nome || 'Serviço não especificado' }}</span>
            <span 
              class="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full tracking-wide"
              :class="getStatusColor(feedback.status)"
            >
              {{ feedback.status }}
            </span>
          </div>
          
          <div class="flex items-center gap-3">
            <div class="flex items-center">
              <q-icon 
                v-for="i in 5" 
                :key="i" 
                :name="i <= feedback.nota ? 'star' : 'star_border'" 
                size="xs" 
                :class="i <= feedback.nota ? 'text-yellow-400' : 'text-gray-300'"
              />
            </div>
            <span class="text-xs text-gray-400 font-medium">{{ formatDate(feedback.createdAt) }}</span>
          </div>
        </div>
        
        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100 relative mt-2">
          <!-- Balão pointer -->
          <div class="absolute -top-1.5 left-4 w-3 h-3 bg-gray-50 border-t border-l border-gray-100 transform rotate-45"></div>
          
          <p class="text-sm text-gray-600 relative z-10 italic">
            "{{ feedback.comentario || 'Cidadão não deixou comentário.' }}"
          </p>
        </div>
        
        <div class="mt-2 flex gap-2" v-if="feedback.categoria">
          <span class="text-[11px] bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-medium border border-blue-100">
            #{{ feedback.categoria }}
          </span>
        </div>
      </div>
    </div>
    
    <div v-else class="py-12 flex flex-col items-center justify-center text-gray-400">
      <q-icon name="speaker_notes_off" size="xl" class="mb-3 opacity-30" />
      <p>Nenhum feedback recebido no período.</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  feedbacks: {
    type: Array,
    required: true,
    default: () => []
  }
});

function getStatusColor(status) {
  if (status === 'RESOLVIDO') return 'bg-green-100 text-green-700';
  if (status === 'ANALISADO') return 'bg-blue-100 text-blue-700';
  return 'bg-orange-100 text-orange-700';
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
</script>
