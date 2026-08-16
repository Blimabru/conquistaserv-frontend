<template>
  <q-page class="p-4">
    <PageCard icon="account_balance" title="Secretarias">
      <TableList
        title="Secretarias"
        titleButtonAdd="Nova Secretaria"
        :column="columns"
        :rows="rows"
        :acoes="acoes"
        :itemsPerPage="itemsPerPage"
        :maxPages="maxPages"
        @getUsers="fetchData"
        @add="openModalAdd"
      />
    </PageCard>

    <q-dialog v-model="isModalOpen" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-white rounded-2xl flex flex-col flex-nowrap" style="width: 800px; max-width: 90vw; max-height: 90vh;">
        <q-toolbar class="bg-gray-50/70 border-b border-gray-100">
          <q-icon :name="isEdit ? 'edit' : 'add_circle'" size="sm" class="text-primary q-mr-sm" />
          <q-toolbar-title class="text-gray-700 font-semibold tracking-wide text-sm uppercase">
            {{ isEdit ? 'Editar Secretaria' : 'Nova Secretaria' }}
          </q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup class="text-gray-500 hover:text-red-500 transition-colors" />
        </q-toolbar>

        <q-card-section class="flex-1 overflow-auto bg-gray-50 p-4">
          <div class="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
            <FormSecretaria v-if="isModalOpen" :secretariaId="currentId" :loading="salvando" @submitData="onSubmit" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import PageCard from 'components/common/PageCard.vue';
import TableList from 'components/tables/TableList.vue';
import FormSecretaria from 'components/forms/FormSecretaria.vue';
import {
  listarSecretarias,
  salvarSecretaria,
  deletarSecretaria,
} from 'src/services/comunicacao/secretariasAdminService';
import confirmDialog from 'src/utils/quasarPlugins/confirmDialog';

const $q = useQuasar();

const itemsPerPage = ref(10);
const maxPages = ref(1);
const rows = ref([]);

const isModalOpen = ref(false);
const currentId = ref('');
const isEdit = computed(() => !!currentId.value);
const salvando = ref(false);

const columns = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
  { name: 'canal', label: 'Canal', field: row => row.canal?.nome || '—', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' },
];

const acoes = [
  {
    name: 'edit',
    label: 'Editar',
    icon: 'edit',
    color: 'primary',
    administrator: true,
    action: (row) => openModalEdit(row.id),
  },
  {
    name: 'delete',
    label: 'Excluir',
    icon: 'delete',
    color: 'negative',
    administrator: true,
    action: (row) => confirmDelete(row),
  },
];

function openModalAdd() {
  currentId.value = '';
  isModalOpen.value = true;
}

function openModalEdit(id) {
  currentId.value = id;
  isModalOpen.value = true;
}

async function onSubmit(data) {
  if (salvando.value) return;
  salvando.value = true;
  try {
    await salvarSecretaria(data, currentId.value);
    $q.notify({ type: 'positive', message: 'Secretaria salva com sucesso!' });
    isModalOpen.value = false;
    fetchData();
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Erro ao salvar secretaria.' });
  } finally {
    salvando.value = false;
  }
}

async function fetchData(busca = '', pagina = 1) {
  try {
    const res = await listarSecretarias(pagina, itemsPerPage.value, busca);
    rows.value = res.data;
    maxPages.value = res.maxPag;
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Erro ao carregar secretarias.' });
  }
}

function confirmDelete(row) {
  confirmDialog({
    title: 'Excluir secretaria',
    message: `Deseja realmente excluir "${row.nome}"?`,
    detail: 'O canal dela também será excluído. Essa ação não pode ser desfeita.',
    confirmLabel: 'Excluir',
  }).onOk(async () => {
    try {
      await deletarSecretaria(row.id);
      $q.notify({ type: 'positive', message: 'Secretaria excluída com sucesso.' });
      fetchData();
    } catch (e) {
      $q.notify({ type: 'negative', message: 'Erro ao excluir secretaria.' });
    }
  });
}

onMounted(() => {
  fetchData();
});
</script>
