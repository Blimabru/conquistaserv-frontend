<template>
  <q-table
    :rows="rows"
    :columns="column"
    row-key="name"
    v-model:pagination="pagination_initial"
    flat
    bordered
    :aria-label="title"
    class="rounded-2xl shadow-sm border border-gray-100"
    table-header-class="bg-gray-50/70 text-gray-600 font-semibold uppercase text-xs tracking-wider"
  >
    <template v-slot:header-cell="props">
      <q-th :props="props" scope="col">{{ props.col.label }}</q-th>
    </template>

    <template v-slot:top>
      <div class="w-full flex flex-col md:flex-row justify-between items-center gap-4 py-2">
        <div class="w-full md:w-auto">
          <q-btn
            color="primary"
            :label="titleButtonAdd"
            @click="routeAdd ? router.push(routeAdd) : $emit('add')"
            no-caps
            icon="add"
            unelevated
            class="rounded-lg font-medium px-4 py-2 w-full md:w-auto"
          />
        </div>

        <div v-if="filters && filters.length" class="flex-1 flex flex-wrap gap-3 items-center justify-center w-full md:w-auto">
          <div v-for="filterOption in filters" :key="filterOption.label" class="min-w-[140px] flex-1 md:flex-none">
            <q-select
              outlined
              dense
              v-model:model-value="filterOption.model"
              :options="filterOption.options"
              :label="filterOption.label"
              @update:model-value="filterOption.actions"
              color="primary"
              class="rounded-lg bg-white"
            />
          </div>
        </div>

        <div class="w-full md:w-auto flex flex-1 items-center justify-end gap-2">
          <q-input
            v-model="filter"
            debounce="500"
            placeholder="Pesquisar..."
            dense
            outlined
            class="rounded-lg bg-white flex-1 md:max-w-[250px]"
            @update:model-value="findInfomaion"
            ref="searchInput"
          >
            <template v-slot:prepend>
              <q-icon
                name="search"
                class="text-gray-500 cursor-pointer hover:text-primary transition-colors"
                @click="focusSearchInput"
              />
            </template>
          </q-input>
          
          <q-btn
            :disable="checkFilter"
            flat
            dense
            round
            color="grey-6"
            aria-label="Limpar filtros"
            class="hover:text-primary hover:bg-blue-50 transition-colors"
            @click="clearAllFilters"
          >
            <q-tooltip class="bg-gray-800 text-xs">Limpar filtros</q-tooltip>
            <q-icon name="cleaning_services" size="20px" />
          </q-btn>
        </div>
      </div>
    </template>

    <template v-slot:body-cell-situacao="props">
      <q-td :props="props">
        <q-chip
          :color="defineColor(props.value)"
          text-color="white"
          size="sm"
          class="font-medium rounded-full px-3 py-0.5 shadow-sm"
        >
          {{ props.value }}
        </q-chip>
      </q-td>
    </template>

    <template v-slot:body-cell-principal="props">
      <q-td :props="props" class="text-center">
        <q-chip
          v-if="props.value"
          color="amber-8"
          text-color="grey-10"
          size="sm"
          icon="star"
          class="font-medium rounded-full px-3 py-0.5 shadow-sm"
        >
          Principal
        </q-chip>
        <span v-else class="text-gray-500 text-xs">—</span>
      </q-td>
    </template>

    <template v-slot:body-cell-acoes="scope">
      <q-td :props="scope">
        <div class="flex justify-center items-center gap-1">
          <template v-for="acao in acoes" :key="acao.name">
            <q-btn
              v-if="acao.administrator"
              flat
              round
              dense
              :color="acao.color"
              :icon="acao.icon"
              size="sm"
              :aria-label="rotuloAcao(acao, scope.row)"
              class="hover:bg-gray-100 transition-colors duration-200"
              @click="acao.action(scope.row)"
            >
              <q-tooltip class="bg-gray-800 text-xs font-medium">{{ acao.label }}</q-tooltip>
            </q-btn>
          </template>
        </div>
      </q-td>
    </template>

    <template v-slot:bottom>
      <div class="w-full flex justify-center items-center py-4 border-t border-gray-50 mt-2">
        <q-pagination
          v-model="pagination_initial.page"
          @update:model-value="findInfomaion"
          color="grey-8"
          active-color="primary"
          active-text-color="white"
          :max="maxPages"
          :max-pages="3"
          direction-links
          boundary-links
          boundary-numbers
          round
          size="14px"
          gutter="sm"
          class="font-medium"
        />
      </div>
    </template>
  </q-table>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const router = useRouter();

const props = defineProps({
  title: {
    type: String,
    required: true,
    default: 'Título da tabela',
  },
  filters: {
    type: Array,
    required: false,
    default: () => [],
  },
  acoes: {
    type: Array,
    required: false,
    default: () => [],
  },
  column: {
    type: Array,
    required: true,
    default: () => [],
  },
  rows: {
    type: Array,
    required: true,
    default: () => [],
  },
  actions: {
    type: Array,
    required: false,
    default: () => [],
  },
  titleButtonAdd: {
    type: String,
    required: false,
    default: 'Adicionar',
  },
  routeAdd: {
    type: String,
    required: false,
    default: '',
  },
  itemsPerPage: {
    type: Number,
    required: false,
    default: 10,
  },
  maxPages: {
    type: Number,
    required: false,
    default: 0,
  },
  sortBy: {
    type: String,
    required: false,
    default: 'nome',
  },
});

const searchInput = ref(null);
const focusSearchInput = () => {
  searchInput.value.focus();
};

const filter = ref('');
const pagination_initial = ref({
  sortBy: props.sortBy,
  descending: false,
  page: 1,
  rowsPerPage: props.itemsPerPage,
  rowsNumber: 0,
});

const checkFilter = computed(() => {
  if (
    filter.value !== '' ||
    props.filters.some((filter) => filter.model !== '')
  ) {
    return false;
  } else {
    return true;
  }
});

function clearAllFilters() {
  filter.value = '';
  pagination_initial.value.page = 1;
  props.filters.forEach((filter) => {
    filter.model = '';
  });
  emits('clearFilters');
}

const emits = defineEmits(['getUsers', 'clearFilters', 'add']);

function findInfomaion() {
  emits('getUsers', filter.value, pagination_initial.value.page);
}

// Nome acessível da ação incluindo o registro da linha, para que o leitor de tela
// anuncie "Excluir: Folha de Ponto" em vez de repetir só "botão" (WCAG 4.1.2).
function rotuloAcao(acao, row) {
  const identificador =
    row?.titulo || row?.nome || row?.name || row?.login || row?.descricao || '';
  return identificador ? `${acao.label}: ${identificador}` : acao.label;
}

// Compara sem diferenciar maiúsculas: a API devolve "ATIVO"/"BLOQUEADO", e o mapa
// anterior só cobria "Ativo"/"Inativo" — todo chip caía no cinza padrão, que além
// de errado tinha contraste de 2,67:1 com o texto branco (WCAG 1.4.3).
const defineColor = (situacao) => {
  const coresPorSituacao = {
    ativo: 'teal-9',
    inativo: 'red-10',
    bloqueado: 'red-10',
  };

  const corPadrao = 'grey-8';

  return coresPorSituacao[String(situacao || '').toLowerCase()] || corPadrao;
};
</script>

<style scoped></style>
