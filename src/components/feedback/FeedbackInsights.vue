<template>
  <div class="bg-gradient-to-br from-blue-600 to-primary p-6 rounded-2xl shadow-md text-white flex flex-col h-full">
    <div class="mb-4 flex items-center gap-2 opacity-90">
      <q-icon name="lightbulb" size="sm" />
      <h3 class="text-lg font-bold">Insights Inteligentes</h3>
    </div>
    
    <div v-if="insights.length > 0" class="flex-1 flex flex-col justify-center space-y-4">
      <div 
        v-for="(insight, index) in insights" 
        :key="index"
        class="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 flex gap-3 items-start"
      >
        <q-icon :name="insight.icon" size="sm" :class="insight.color" class="mt-0.5" />
        <p class="text-sm font-medium leading-relaxed">{{ insight.text }}</p>
      </div>
    </div>
    
    <div v-else class="flex-1 flex flex-col items-center justify-center opacity-70">
      <q-icon name="auto_awesome" size="xl" class="mb-3" />
      <p class="text-center text-sm font-medium">Coletando mais dados para gerar insights...</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  metrics: {
    type: Object,
    required: true,
    default: () => ({})
  }
});

const insights = computed(() => {
  const result = [];
  const m = props.metrics;
  
  if (!m || !m.total || m.total === 0) return result;

  if (m.positivasPct > 70) {
    result.push({
      icon: 'sentiment_very_satisfied',
      color: 'text-green-300',
      text: `Excelente! A grande maioria (${m.positivasPct}%) dos cidadãos avaliou os serviços positivamente neste período.`
    });
  } else if (m.negativasPct > 40) {
    result.push({
      icon: 'warning',
      color: 'text-red-300',
      text: `Atenção: Uma parcela significativa (${m.negativasPct}%) das avaliações são negativas (Notas 1 a 3).`
    });
  }

  if (m.categorias && m.categorias.length > 0) {
    const piorCategoria = m.categorias[0];
    const pctCategoria = Math.round((piorCategoria.count / m.total) * 100);
    
    // Só mostramos se for realmente expressivo (mais de 15%)
    if (pctCategoria > 15) {
      result.push({
        icon: 'pie_chart',
        color: 'text-orange-300',
        text: `O principal motivo de registro é "${piorCategoria.nome}", presente em ${pctCategoria}% dos feedbacks recebidos.`
      });
    }
  }

  if (m.servicos && m.servicos.length > 1) {
    const melhor = m.servicos[0];
    const pior = m.servicos[m.servicos.length - 1];
    
    if (melhor.media >= 4.0 && melhor.total >= 3) {
      result.push({
        icon: 'workspace_premium',
        color: 'text-yellow-300',
        text: `"${melhor.nome}" é o serviço melhor avaliado, com nota média de ${melhor.media.toFixed(1)}.`
      });
    }
    
    if (pior.media <= 3.0 && pior.total >= 3) {
      result.push({
        icon: 'trending_down',
        color: 'text-red-300',
        text: `O serviço "${pior.nome}" necessita de melhorias urgentes (Média: ${pior.media.toFixed(1)}).`
      });
    }
  }

  return result.slice(0, 3); // Retorna no máximo 3 insights
});
</script>
