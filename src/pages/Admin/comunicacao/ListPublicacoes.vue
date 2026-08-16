<template>
  <q-page class="p-4">
    <PageCard icon="article" title="Publicações">
      <TableList
        title="Publicações"
        titleButtonAdd="Nova Publicação"
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
          <q-icon :name="isEdit ? 'edit' : 'post_add'" size="sm" class="text-primary q-mr-sm" />
          <q-toolbar-title class="text-gray-700 font-semibold tracking-wide text-sm uppercase">
            {{ isEdit ? 'Editar Publicação' : 'Nova Publicação' }}
          </q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup class="text-gray-500 hover:text-red-500 transition-colors" />
        </q-toolbar>

        <q-card-section class="flex-1 overflow-auto bg-gray-50 p-4">
          <div class="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
            <FormPublicacao v-if="isModalOpen" :publicacaoId="currentId" :loading="salvando" @submitData="onSubmit" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import PageCard from 'components/common/PageCard.vue';
import TableList from 'components/tables/TableList.vue';
import FormPublicacao from 'components/forms/FormPublicacao.vue';
import { listarPublicacoes, salvarPublicacao, deletarPublicacao } from 'src/services/comunicacao/publicacoesAdminService';
import confirmDialog from 'src/utils/quasarPlugins/confirmDialog';
import { date } from 'quasar';

const router = useRouter();
const $q = useQuasar();

const itemsPerPage = ref(10);
const maxPages = ref(1);
const rows = ref([]);

const isModalOpen = ref(false);
const currentId = ref('');
const isEdit = computed(() => !!currentId.value);
const salvando = ref(false);

const columns = [
  { name: 'titulo', label: 'Título', field: 'titulo', align: 'left' },
  { name: 'canal', label: 'Canal', field: row => row.canal?.nome, align: 'left' },
  { name: 'data', label: 'Publicação', field: row => date.formatDate(row.dataPublicacao, 'DD/MM/YYYY HH:mm'), align: 'center' },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' }
];

const acoes = [
  {
    name: 'analytics',
    label: 'Métricas',
    icon: 'bar_chart',
    color: 'secondary',
    administrator: true,
    action: (row) => router.push(`/admin/comunicacao/publicacoes/${row.id}/analytics`)
  },
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
  if (salvando.value) return; // evita duplicidade em duplo clique/duplo submit
  salvando.value = true;
  try {
    await salvarPublicacao(data, currentId.value);
    $q.notify({ type: 'positive', message: 'Publicação salva com sucesso!' });
    isModalOpen.value = false;
    fetchData(); // Atualiza a tabela
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Erro ao salvar publicação.' });
  } finally {
    salvando.value = false;
  }
}

async function fetchData(busca = '', pagina = 1) {
  try {
    const res = await listarPublicacoes(null, pagina, itemsPerPage.value, busca);
    rows.value = res.data;
    maxPages.value = res.maxPag;
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Erro ao carregar publicações.' });
  }
}

function confirmDelete(row) {
  confirmDialog({
    title: 'Excluir publicação',
    message: `Deseja realmente excluir "${row.titulo}"?`,
    detail: 'Essa ação não pode ser desfeita.',
    confirmLabel: 'Excluir',
  }).onOk(async () => {
    try {
      await deletarPublicacao(row.id);
      $q.notify({ type: 'positive', message: 'Publicação excluída.' });
      fetchData();
    } catch (e) {
      $q.notify({ type: 'negative', message: 'Erro ao excluir.' });
    }
  });
}

onMounted(() => {
  fetchData();
});
</script>
