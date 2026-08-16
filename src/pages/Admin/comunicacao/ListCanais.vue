<template>
  <q-page class="p-4">
    <PageCard icon="campaign" title="Canais de Comunicação">
      <TableList
        title="Canais"
        titleButtonAdd="Novo Canal"
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
      <q-card class="bg-white rounded-2xl flex flex-col flex-nowrap" style="width: 800px; max-width: 90vw; max-height: 90vh;">
        <q-toolbar class="bg-gray-50/70 border-b border-gray-100">
          <q-icon :name="isEdit ? 'edit' : 'add_circle'" size="sm" class="text-primary q-mr-sm" />
          <q-toolbar-title class="text-gray-700 font-semibold tracking-wide text-sm uppercase">
            {{ isEdit ? 'Editar Canal' : 'Novo Canal' }}
          </q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup class="text-gray-500 hover:text-red-500 transition-colors" />
        </q-toolbar>

        <q-card-section class="flex-1 overflow-auto bg-gray-50 p-4">
          <div class="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
            <FormCanal v-if="isModalOpen" :canalId="currentId" :loading="salvando" @submitData="onSubmit" />
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
import FormCanal from 'components/forms/FormCanal.vue';
import { listarCanais, salvarCanal, deletarCanal } from 'src/services/comunicacao/canaisAdminService';
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
  { name: 'secretaria', label: 'Secretaria', field: row => row.secretaria?.nome || '—', align: 'left' },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left', sortable: true },
  { name: 'principal', label: 'Principal', field: 'oficial', align: 'center' },
  { name: 'membros', label: 'Membros', field: 'totalMembros', align: 'center' },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' }
];

const acoes = [
  {
    name: 'edit',
    label: 'Editar',
    icon: 'edit',
    color: 'primary',
    administrator: true,
    action: (row) => openModalEdit(row.id)
  },
  {
    name: 'delete',
    label: 'Excluir',
    icon: 'delete',
    color: 'negative',
    administrator: true,
    action: (row) => confirmDelete(row)
  }
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
    await salvarCanal(data, currentId.value);
    $q.notify({ type: 'positive', message: 'Canal salvo com sucesso!' });
    isModalOpen.value = false;
    fetchData();
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Erro ao salvar canal.' });
  } finally {
    salvando.value = false;
  }
}

async function fetchData(busca = '', pagina = 1) {
  try {
    const res = await listarCanais(pagina, itemsPerPage.value, busca);
    rows.value = res.data;
    maxPages.value = res.maxPag;
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Erro ao carregar canais.' });
  }
}

function confirmDelete(row) {
  confirmDialog({
    title: 'Excluir canal',
    message: `Deseja realmente excluir o canal "${row.nome}"?`,
    detail: 'Essa ação não pode ser desfeita.',
    confirmLabel: 'Excluir',
  }).onOk(async () => {
    try {
      await deletarCanal(row.id);
      $q.notify({ type: 'positive', message: 'Canal excluído com sucesso.' });
      fetchData();
    } catch (e) {
      $q.notify({ type: 'negative', message: 'Erro ao excluir canal.' });
    }
  });
}

onMounted(() => {
  fetchData();
});
</script>
