<template>
  <div class="w-full py-4 flex flex-col items-center">

    <div class="flex flex-nowrap items-center justify-center gap-4 overflow-x-auto no-scrollbar w-full" style="scroll-behavior: smooth;">
      
      <!-- Home / Feed Geral -->
      <router-link
        to="/comunicacao"
        class="flex flex-col flex-none items-center gap-1.5 w-[72px] group no-underline"
        aria-label="Feed Geral"
      >
        <div class="flex h-[64px] w-[64px] items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105"
             :class="ehGeral ? 'border-[3px] border-primary p-1' : 'border-[3px] border-transparent p-1'">
          <div class="flex h-full w-full items-center justify-center rounded-full border border-gray-100 bg-primary text-white shadow-sm overflow-hidden">
            <q-icon name="home" size="30px" />
          </div>
        </div>
        <span class="text-[13px] font-medium text-gray-700 truncate w-full text-center"
              :class="ehGeral ? 'text-primary' : ''">Geral</span>
      </router-link>

      <!-- Skeleton Loading -->
      <template v-if="carregando">
        <div v-for="i in 5" :key="i" class="flex flex-col flex-none items-center gap-1.5 w-[72px]">
          <q-skeleton type="QAvatar" size="64px" />
          <q-skeleton type="text" width="48px" class="mt-1" />
        </div>
      </template>

      <!-- Atalhos Salvos -->
      <template v-else>
        <div
          v-for="canal in canaisAtalhos"
          :key="canal.id"
          class="relative flex flex-col flex-none items-center gap-1.5 w-[72px] group"
        >
          <router-link
            :to="`/comunicacao/canais/${canal.id}`"
            class="flex flex-col items-center gap-1.5 w-full no-underline"
            :aria-label="canal.nome"
          >
            <div class="flex h-[64px] w-[64px] items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105"
                 :class="canalAtivoId === canal.id ? 'border-[3px] border-primary p-1' : 'border-[3px] border-transparent p-1'">
              <!-- canal.cor é um hexadecimal (ex: #045DA5) — CSS puro via :style,
                   não dá pra virar classe Tailwind/Quasar :color dinamicamente. -->
              <q-avatar :style="{ backgroundColor: canal.cor }" text-color="white" size="56px">
                <q-icon :name="canal.icone" size="30px" />
              </q-avatar>
            </div>
            <span class="text-[13px] font-medium text-gray-700 truncate w-full text-center"
                  :class="canalAtivoId === canal.id ? 'text-primary font-medium' : ''">{{ canal.nome }}</span>
          </router-link>

          
          <q-btn
            round
            dense
            size="8px"
            color="negative"
            icon="close"
            class="absolute top-0 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm z-10"
            @click.prevent="removerAtalho(canal.id)"
          >
            <q-tooltip>Remover atalho</q-tooltip>
          </q-btn>
        </div>
      </template>

      <!-- Botão Descobrir/Todos -->
      <div
        v-if="!textoBusca"
        class="flex flex-col flex-none items-center gap-1.5 w-[72px] group cursor-pointer ml-1"
        aria-label="Ver todos os canais"
        @click="modalDescobrirAberto = true"
      >
        <div class="flex h-[64px] w-[64px] items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105 border-[3px] border-transparent p-1">
          <div class="flex h-full w-full items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-white text-gray-400 group-hover:border-gray-400 group-hover:text-gray-500 group-hover:bg-gray-50">
            <q-icon name="add" size="28px" />
          </div>
        </div>
        <span class="text-[13px] font-medium text-gray-400 truncate w-full text-center group-hover:text-gray-500">Canais</span>
      </div>

    </div>

    <!-- Modal Descobrir Canais -->
    <ModalDescobrirCanais v-model="modalDescobrirAberto" />
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { listarCanais } from 'src/services/comunicacaoService';
import ModalDescobrirCanais from './ModalDescobrirCanais.vue';

const route = useRoute();
const carregando = ref(true);
const todosCanais = ref([]);
const triggerUpdate = ref(0); 
const modalDescobrirAberto = ref(false);

const ehGeral = computed(() => route.path === '/comunicacao' && !route.params.id);
const canalAtivoId = computed(() =>
  route.path.startsWith('/comunicacao/canais/') ? route.params.id : null,
);

const canaisAtalhos = computed(() => {
  triggerUpdate.value; 
  
  const atalhosIds = (localStorage.getItem('conquistaserv_atalhos_canais') || '').split(',').filter(Boolean);
  
  if (atalhosIds.length > 0) {
    return atalhosIds.map(id => todosCanais.value.find(c => c.id.toString() === id)).filter(Boolean);
  } else {
    return todosCanais.value.slice(0, 5);
  }
});

function forceUpdate() {
  triggerUpdate.value++;
}

function removerAtalho(id) {
  let atalhosIds = (localStorage.getItem('conquistaserv_atalhos_canais') || '').split(',').filter(Boolean);
  atalhosIds = atalhosIds.filter(a => a !== id.toString());
  localStorage.setItem('conquistaserv_atalhos_canais', atalhosIds.join(','));
  forceUpdate();
  window.dispatchEvent(new Event('atalhosCanaisAtualizados'));
}

async function carregar() {
  carregando.value = true;
  try {
    // listarCanais() já devolve todo canal público (não exige mais "seguir")
    // mais os privados dos quais o usuário é membro.
    todosCanais.value = await listarCanais();
  } finally {
    carregando.value = false;
  }
}

watch(
  () => route.path,
  () => carregar(),
);

onMounted(() => {
  carregar();
  window.addEventListener('atalhosCanaisAtualizados', forceUpdate);
});

onUnmounted(() => {
  window.removeEventListener('atalhosCanaisAtualizados', forceUpdate);
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;  
  scrollbar-width: none;  
}
</style>
