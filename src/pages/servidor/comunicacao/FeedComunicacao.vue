<template>
  <q-page class="bg-gray-50 pb-8">
    <CanaisAtalhos />
    <div class="mx-auto max-w-[760px] px-4 pt-6">
      
      <div v-if="buscaAtual" class="mb-4 flex flex-nowrap items-center justify-between">
        <h1 class="text-xl font-medium text-gray-800">Comunicação</h1>
        <q-chip
          removable
          color="primary-light"
          text-color="primary"
          @remove="limparBusca"
        >
          Busca: "{{ buscaAtual }}"
        </q-chip>
      </div>

      
      <FeedPublicacoes
        :key="chaveFeed"
        :carregar-fonte="carregarFonte"
        :mensagem-vazio="mensagemVazio"
      />
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FeedPublicacoes from 'src/components/comunicacao/FeedPublicacoes.vue';
import CanaisAtalhos from 'src/components/comunicacao/CanaisAtalhos.vue';
import { listarFeed } from 'src/services/comunicacaoService';

const route = useRoute();
const router = useRouter();

const aba = ref('geral');

const buscaAtual = computed(() => route.query.busca || '');
const chaveFeed = computed(() => `${aba.value}|${buscaAtual.value}`);

const mensagemVazio = computed(() => {
  if (buscaAtual.value) return 'Nenhuma publicação encontrada para essa busca.';
  if (aba.value === 'destaques') return 'Sem destaques no momento.';
  return 'Você ainda não segue canais com publicações. Explore os canais disponíveis.';
});

function carregarFonte({ pagina, itensPorPagina }) {
  return listarFeed({
    pagina,
    itensPorPagina,
    busca: buscaAtual.value,
    apenasDestaques: aba.value === 'destaques',
  });
}

function limparBusca() {
  router.push({ path: '/comunicacao' });
}
</script>
