<template>
  <q-page class="p-4">
    <PageCard icon="description" title="Documentos">
      <TableList
        title="Documentos"
        titleButtonAdd="Novo Documento"
        :column="columns"
        :rows="rows"
        :acoes="acoes"
        :itemsPerPage="itemsPerPage"
        :maxPages="maxPages"
        sortBy=""
        @getUsers="fetchData"
        @add="openModalAdd"
      />
    </PageCard>

    <q-dialog v-model="isModalOpen" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-white rounded-2xl flex flex-col flex-nowrap" style="width: 700px; max-width: 90vw; max-height: 90vh;">
        <q-toolbar class="bg-gray-50/70 border-b border-gray-100">
          <q-icon :name="isEdit ? 'edit' : 'add_circle'" size="sm" class="text-primary q-mr-sm" />
          <q-toolbar-title class="text-gray-700 font-semibold tracking-wide text-sm uppercase">
            {{ isEdit ? 'Editar Documento' : 'Novo Documento' }}
          </q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup class="text-gray-500 hover:text-red-500 transition-colors" />
        </q-toolbar>

        <q-card-section class="flex-1 overflow-auto bg-gray-50 p-4">
          <div class="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
            <FormDocumento v-if="isModalOpen" :documentoId="currentId" :loading="salvando" @submitData="onSubmit" />
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
import FormDocumento from 'components/forms/FormDocumento.vue';
import {
  listarDocumentos,
  salvarDocumento,
  deletarDocumento,
} from 'src/services/documentos/documentosAdminService';
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
  { name: 'titulo', label: 'Título', field: 'titulo', align: 'left', sortable: true },
  { name: 'categoria', label: 'Categoria', field: 'categoria', align: 'left' },
  { name: 'versao', label: 'Versão', field: 'versao', align: 'left' },
  { name: 'ativo', label: 'Ativo', field: row => row.ativo ? 'Sim' : 'Não', align: 'left' },
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
    await salvarDocumento(data, currentId.value);
    $q.notify({ type: 'positive', message: 'Documento salvo com sucesso!' });
    isModalOpen.value = false;
    fetchData();
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Erro ao salvar documento.' });
  } finally {
    salvando.value = false;
  }
}

async function fetchData(busca = '', pagina = 1) {
  try {
    const res = await listarDocumentos(pagina, itemsPerPage.value, busca);
    rows.value = res.data;
    maxPages.value = res.maxPag;
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Erro ao carregar documentos.' });
  }
}

function confirmDelete(row) {
  confirmDialog({
    title: 'Excluir documento',
    message: `Deseja realmente excluir "${row.titulo}"?`,
    detail: 'Essa ação não pode ser desfeita.',
    confirmLabel: 'Excluir',
  }).onOk(async () => {
    try {
      await deletarDocumento(row.id);
      $q.notify({ type: 'positive', message: 'Documento excluído com sucesso.' });
      fetchData();
    } catch (e) {
      $q.notify({ type: 'negative', message: 'Erro ao excluir documento.' });
    }
  });
}

onMounted(() => {
  fetchData();
});
</script>
