<template>
  <q-card flat bordered class="flex flex-nowrap h-full flex-col rounded-xl border-gray-200/80 transition-shadow duration-200 hover:shadow-md cursor-pointer" @click="$emit('abrir')">
    <q-card-section class="flex flex-nowrap items-center">
      <q-avatar :style="{ backgroundColor: canal.cor }" text-color="white" :icon="canal.icone" size="48px" />

      <div class="ml-4 grow">
        <div class="flex flex-nowrap items-center gap-1">
          <span class="text-base font-medium text-gray-800">{{ canal.nome }}</span>

          <q-icon
            v-if="canal.tipo === 'PRIVADO'"
            name="lock"
            color="grey-6"
            size="15px"
          >
            <q-tooltip>Canal restrito</q-tooltip>
          </q-icon>
          
          <div class="grow" />
          <q-btn
            v-if="contexto === 'publico'"
            flat
            dense
            round
            size="sm"
            :color="isFixado ? 'amber-6' : 'grey-4'"
            :icon="isFixado ? 'star' : 'star_border'"
            :aria-label="isFixado ? `Remover ${canal.nome} dos atalhos` : `Fixar ${canal.nome} nos atalhos`"
            :aria-pressed="isFixado"
            @click.stop="toggleFixar"
          >
            <q-tooltip>{{ isFixado ? 'Remover dos atalhos' : 'Fixar nos atalhos' }}</q-tooltip>
          </q-btn>
        </div>
        <div class="text-[13px] text-gray-600 leading-tight mt-0.5 line-clamp-2">{{ canal.descricao }}</div>
        <div class="mt-1.5 text-[11px] font-medium text-gray-500">
          {{ canal.totalPublicacoes }} {{ canal.totalPublicacoes === 1 ? 'publicação' : 'publicações' }}
        </div>
      </div>
    </q-card-section>

    
    <q-card-actions v-if="contexto === 'publico'" class="mt-auto flex flex-nowrap items-center bg-gray-50/50 px-4 py-2 border-t border-gray-100" @click.stop>
      <div class="text-[12px] font-medium text-gray-500 mr-2">Notificações</div>
      <q-toggle
        :model-value="canal.notificacoesAtivas"
        color="primary"
        dense
        size="sm"
        @update:model-value="$emit('toggle-notificacao', $event)"
      />
      <div class="grow" />
      <div class="flex items-center text-primary text-xs font-medium group-hover:underline">
        Acessar feed <q-icon name="arrow_forward" size="14px" class="ml-1" />
      </div>
    </q-card-actions>

    
    <q-card-actions v-else class="mt-auto bg-gray-50/50 border-t border-gray-100" @click.stop>
      <div class="w-full py-1 text-center text-xs text-gray-500">
        <q-icon name="lock" size="14px" class="mr-1" /> Acesso restrito
      </div>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  canal: { type: Object, required: true },
  contexto: { type: String, required: true },
});
defineEmits(['toggle-notificacao', 'abrir']);

const isFixado = ref(false);
const LOCAL_KEY = 'conquistaserv_atalhos_canais';

function checkFixado() {
  const atalhos = (localStorage.getItem(LOCAL_KEY) || '').split(',').filter(Boolean);
  isFixado.value = atalhos.includes(props.canal.id.toString());
}

function toggleFixar() {
  let atalhos = (localStorage.getItem(LOCAL_KEY) || '').split(',').filter(Boolean);
  const idStr = props.canal.id.toString();
  
  if (isFixado.value) {
    atalhos = atalhos.filter(id => id !== idStr);
  } else {
    atalhos.push(idStr);
  }
  
  localStorage.setItem(LOCAL_KEY, atalhos.join(','));
  isFixado.value = !isFixado.value;
  
  window.dispatchEvent(new Event('atalhosCanaisAtualizados'));
}

onMounted(() => {
  checkFixado();
  window.addEventListener('atalhosCanaisAtualizados', checkFixado);
});
</script>
