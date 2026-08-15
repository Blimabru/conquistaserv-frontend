<template>
  <div>
    
    <div v-if="carregando" class="flex flex-col flex-nowrap items-center py-16 text-gray-500">
      <q-spinner-dots color="primary" size="42px" />
      <div class="mt-2">Carregando publicações...</div>
    </div>

    
    <div
      v-else-if="!publicacoes.length"
      class="flex flex-col flex-nowrap items-center py-16 text-gray-500"
    >
      <q-icon name="inbox" size="56px" />
      <div class="mt-2 text-lg">Nenhuma publicação por aqui</div>
      <div class="text-xs">{{ mensagemVazio }}</div>
    </div>

    
    <template v-else>
      <PublicacaoCard
        v-for="pub in publicacoes"
        :key="pub.id"
        :publicacao="pub"
      />

      <div v-if="maxPag > 1" class="mt-4 flex flex-nowrap justify-center">
        <q-pagination
          v-model="pagina"
          :max="maxPag"
          :max-pages="6"
          direction-links
          boundary-links
          color="primary"
          @update:model-value="carregar"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import PublicacaoCard from './PublicacaoCard.vue';

const props = defineProps({
  carregarFonte: {
    type: Function,
    required: true,
  },
  mensagemVazio: {
    type: String,
    default: 'Assim que houver novidades, elas aparecem aqui.',
  },
  itensPorPagina: {
    type: Number,
    default: 10,
  },
});

const publicacoes = ref([]);
const carregando = ref(false);
const pagina = ref(1);
const maxPag = ref(1);

async function carregar() {
  carregando.value = true;
  try {
    const { data, maxPag: mp } = await props.carregarFonte({
      pagina: pagina.value,
      itensPorPagina: props.itensPorPagina,
    });
    publicacoes.value = data;
    maxPag.value = mp;
  } catch (e) {
    console.error('Erro ao carregar feed:', e);
    publicacoes.value = [];
  } finally {
    carregando.value = false;
  }
}

onMounted(carregar);
</script>
