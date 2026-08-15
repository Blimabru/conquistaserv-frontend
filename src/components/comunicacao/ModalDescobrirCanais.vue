<template>
  <q-dialog v-model="visivel" position="standard" :maximized="$q.screen.lt.sm">
    <div class="bg-white rounded-lg overflow-hidden flex flex-col flex-nowrap" style="max-height: 80vh; width: 700px; max-width: 90vw; margin: 0 auto;">
      <div class="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 class="text-xl font-medium text-gray-800 flex items-center m-0">
          <q-icon name="hub" size="24px" color="primary" class="mr-2" /> Descobrir Canais
        </h2>
        <q-btn flat round dense icon="close" v-close-popup />
      </div>

      <!-- Pesquisa de canais dentro do modal -->
      <div class="px-5 pt-4 bg-gray-50">
        <q-input
          v-model="textoBusca"
          dense
          outlined
          rounded
          placeholder="Pesquisar canais..."
          bg-color="white"
          color="primary"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append v-if="textoBusca">
            <q-icon name="close" @click="textoBusca = ''" class="cursor-pointer" />
          </template>
        </q-input>
      </div>

      <div class="p-5 overflow-y-auto bg-gray-50" style="flex: 1 1 auto;">
        <div v-if="carregando" class="flex flex-col flex-nowrap items-center py-16 text-gray-500">
          <q-spinner-dots color="primary" size="42px" />
          <div class="mt-2">Carregando canais...</div>
        </div>

        <template v-else>
          <SecaoCanais
            titulo="Canais Públicos"
            subtitulo="Acompanhe as publicações abertas a todos os servidores."
            icone="public"
            :canais="todosPublicosFiltrados"
            contexto="publico"
            vazio="Nenhum canal público encontrado."
            @toggle-notificacao="onToggleNotificacao"
            @abrir="abrir"
          />

          <SecaoCanais
            v-if="privadosFiltrados.length"
            class="mt-8"
            titulo="Canais Restritos"
            subtitulo="Acesso concedido pela gestão."
            icone="lock"
            :canais="privadosFiltrados"
            contexto="privado"
            vazio=""
          />
        </template>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import SecaoCanais from 'src/components/comunicacao/SecaoCanais.vue';
import { listarCanais, configurarNotificacao } from 'src/services/comunicacaoService';
import { useQuasar } from 'quasar';

const props = defineProps({
  modelValue: { type: Boolean, default: false }
});
const emit = defineEmits(['update:modelValue']);

const router = useRouter();
const $q = useQuasar();

const visivel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const carregando = ref(true);
const textoBusca = ref('');
const canais = ref({ meus: [], disponiveis: [], privados: [] });

const todosPublicosFiltrados = computed(() => {
  const lista = [...(canais.value.meus || []), ...(canais.value.disponiveis || [])];
  if (!textoBusca.value) return lista;
  const termo = textoBusca.value.toLowerCase();
  return lista.filter(c => c.nome.toLowerCase().includes(termo) || (c.descricao && c.descricao.toLowerCase().includes(termo)));
});

const privadosFiltrados = computed(() => {
  const lista = canais.value.privados || [];
  if (!textoBusca.value) return lista;
  const termo = textoBusca.value.toLowerCase();
  return lista.filter(c => c.nome.toLowerCase().includes(termo) || (c.descricao && c.descricao.toLowerCase().includes(termo)));
});

async function carregar() {
  carregando.value = true;
  try {
    canais.value = await listarCanais();
  } catch (e) {
    console.error('Erro ao carregar canais:', e);
  } finally {
    carregando.value = false;
  }
}

watch(visivel, (val) => {
  if (val) {
    carregar();
  }
});

async function onToggleNotificacao(canal, ativo) {
  await configurarNotificacao(canal.id, ativo);
  canal.notificacoesAtivas = ativo;
}

function abrir(canal) {
  visivel.value = false;
  router.push(`/comunicacao/canais/${canal.id}`);
}
</script>
