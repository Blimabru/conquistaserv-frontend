<template>
  <q-page class="bg-gray-50 pb-8">
    <CanaisAtalhos />
    <div class="mx-auto max-w-[780px] p-4 pt-6">
      <q-btn
        flat
        no-caps
        dense
        color="primary"
        icon="arrow_back"
        label="Comunicação"
        class="mb-2"
        to="/comunicacao"
      />

      <div v-if="carregando" class="flex flex-col flex-nowrap items-center py-16 text-gray-500">
        <q-spinner-dots color="primary" size="42px" />
      </div>

      <template v-else-if="canal">
        
        <q-card flat bordered class="mb-4 rounded-lg">
          <q-card-section class="flex flex-nowrap items-center">
            <q-avatar
              :color="canal.cor"
              text-color="white"
              :icon="canal.icone"
              size="52px"
            />
            <div class="ml-4 grow">
              <div class="flex flex-nowrap items-center gap-1">
                <span class="text-lg font-medium">{{ canal.nome }}</span>
                <q-icon v-if="canal.oficial" name="verified" color="primary" size="18px" />
                <q-icon v-if="canal.tipo === 'PRIVADO'" name="lock" color="grey-6" size="16px" />
              </div>
              <div class="text-xs text-gray-600">{{ canal.descricao }}</div>
            </div>

            <q-toggle
              v-if="canal.souMembro"
              :model-value="canal.notificacoesAtivas"
              color="primary"
              icon="notifications"
              @update:model-value="alterarNotificacao"
            >
              <q-tooltip>Receber notificações deste canal</q-tooltip>
            </q-toggle>
          </q-card-section>
        </q-card>

        
        <q-banner
          v-if="!canal.souMembro && canal.tipo === 'PRIVADO'"
          class="rounded-lg bg-gray-100 text-gray-700"
        >
          <template #avatar>
            <q-icon name="lock" color="grey-7" />
          </template>
          Este é um canal restrito. O acesso é concedido pela gestão.
        </q-banner>

        <!-- feed do canal -->
        <FeedPublicacoes
          v-else
          :carregar-fonte="carregarDoCanal"
          mensagem-vazio="Este canal ainda não tem publicações."
        />
      </template>

      <q-banner v-else class="rounded-lg bg-red-50 text-negative">
        Canal não encontrado.
      </q-banner>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import FeedPublicacoes from 'src/components/comunicacao/FeedPublicacoes.vue';
import CanaisAtalhos from 'src/components/comunicacao/CanaisAtalhos.vue';
import {
  buscarCanal,
  listarPorCanal,
  configurarNotificacao,
} from 'src/services/comunicacaoService';

const route = useRoute();
const canal = ref(null);
const carregando = ref(true);

function carregarDoCanal(params) {
  return listarPorCanal(route.params.id, params);
}

async function alterarNotificacao(ativo) {
  await configurarNotificacao(canal.value.id, ativo);
  canal.value.notificacoesAtivas = ativo;
}

async function carregar() {
  carregando.value = true;
  try {
    canal.value = await buscarCanal(route.params.id);
  } catch (e) {
    canal.value = null;
  } finally {
    carregando.value = false;
  }
}

onMounted(carregar);
</script>
