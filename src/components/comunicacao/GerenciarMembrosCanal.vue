<template>
  <div>
    <div class="flex items-center gap-2 mb-4">
      <q-select
        outlined
        dense
        use-input
        hide-selected
        fill-input
        input-debounce="400"
        class="flex-1"
        label="Adicionar usuário ao canal"
        :options="opcoesUsuarios"
        option-label="label"
        option-value="value"
        @filter="buscarUsuarios"
        @update:model-value="onSelecionarUsuario"
        :model-value="null"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-gray-500">
              {{ buscando ? 'Buscando…' : 'Digite para buscar um usuário' }}
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

    <div v-if="carregando" class="flex justify-center py-6">
      <q-spinner color="primary" size="2em" />
    </div>

    <div v-else-if="!membros.length" class="text-sm text-gray-500 py-4">
      Nenhum membro neste canal ainda.
    </div>

    <ul v-else class="divide-y divide-gray-100 border border-gray-100 rounded-lg">
      <li
        v-for="membro in membros"
        :key="membro.id"
        class="flex items-center justify-between px-4 py-2.5"
      >
        <div>
          <div class="text-sm font-medium text-gray-800">{{ membro.usuario.nome }}</div>
          <div class="text-xs text-gray-500">{{ membro.usuario.login }} · {{ membro.usuario.email }}</div>
        </div>
        <q-btn
          flat
          dense
          round
          icon="close"
          color="negative"
          size="sm"
          title="Remover do canal"
          @click="removerMembro(membro)"
        />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
import confirmDialog from 'src/utils/quasarPlugins/confirmDialog';
import {
  listarMembrosCanal,
  adicionarMembroCanal,
  removerMembroCanal,
} from 'src/services/comunicacao/canaisAdminService';

const props = defineProps({
  canalId: { type: String, required: true },
});

const $q = useQuasar();

const membros = ref([]);
const carregando = ref(true);
const buscando = ref(false);
const opcoesUsuarios = ref([]);

async function carregarMembros() {
  carregando.value = true;
  try {
    const res = await listarMembrosCanal(props.canalId, 1, 100);
    membros.value = res.data;
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Erro ao carregar membros do canal.' });
  } finally {
    carregando.value = false;
  }
}

async function buscarUsuarios(termo, update) {
  if (!termo) {
    update(() => { opcoesUsuarios.value = []; });
    return;
  }
  buscando.value = true;
  try {
    const { data } = await api.get('usuarios', {
      params: { pagina: 1, itensPorPagina: 10, busca: termo },
    });
    const jaMembros = new Set(membros.value.map((m) => m.usuarioId));
    update(() => {
      opcoesUsuarios.value = data.data
        .filter((u) => !jaMembros.has(u.id))
        .map((u) => ({ label: `${u.nome} (${u.login})`, value: u.id }));
    });
  } finally {
    buscando.value = false;
  }
}

async function onSelecionarUsuario(opcao) {
  if (!opcao) return;
  try {
    await adicionarMembroCanal(props.canalId, opcao.value);
    $q.notify({ type: 'positive', message: 'Membro adicionado ao canal.' });
    await carregarMembros();
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Erro ao adicionar membro.' });
  }
}

async function removerMembro(membro) {
  confirmDialog({
    title: 'Remover membro',
    message: `Remover "${membro.usuario.nome}" deste canal?`,
    detail: 'A pessoa perde acesso imediatamente ao conteúdo deste canal.',
    confirmLabel: 'Remover',
    variant: 'warning',
  }).onOk(async () => {
    try {
      await removerMembroCanal(props.canalId, membro.usuarioId);
      $q.notify({ type: 'positive', message: 'Membro removido.' });
      await carregarMembros();
    } catch (e) {
      $q.notify({ type: 'negative', message: 'Erro ao remover membro.' });
    }
  });
}

onMounted(() => {
  carregarMembros();
});
</script>
