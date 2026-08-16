<template>
  <q-form @submit.prevent.stop="sendData" greedy class="text-gray-700">
    <div class="mb-6">
      <h3 class="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <q-icon name="info" size="20px" class="text-primary" />
        Identificação
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-12 gap-5">
        <div class="md:col-span-6">
          <label class="block text-sm font-medium text-gray-600 mb-1">Nome do Serviço <span class="text-red-500">*</span></label>
          <q-input
            dense
            outlined
            v-model="form.nome"
            placeholder="Ex: Contra Cheque, Escola Virtual..."
            class="rounded-lg bg-gray-50/50"
            :rules="[val => !!val || '*Campo obrigatório']"
            hide-bottom-space
          />
        </div>

        <div class="md:col-span-6">
          <label class="block text-sm font-medium text-gray-600 mb-1">Categoria</label>
          <q-select
            dense
            outlined
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            new-value-mode="add-unique"
            v-model="form.categoria"
            :options="categoriasFiltradas"
            @filter="filtrarCategorias"
            @new-value="criarCategoria"
            @input-value="val => form.categoria = val"
            placeholder="Ex: Financeiro, Saúde..."
            class="rounded-lg bg-gray-50/50"
            hide-bottom-space
          />
        </div>

        <div class="md:col-span-12">
          <label class="block text-sm font-medium text-gray-600 mb-1">Descrição</label>
          <q-input
            dense
            outlined
            v-model="form.descricao"
            type="textarea"
            rows="2"
            placeholder="Para que serve este serviço?"
            class="rounded-lg bg-gray-50/50"
            hide-bottom-space
          />
        </div>
      </div>
    </div>

    <q-separator class="my-6 opacity-50" />

    <div class="mb-6 bg-blue-50/30 p-5 rounded-2xl border border-blue-100/50">
      <h3 class="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <q-icon name="palette" size="20px" class="text-primary" />
        Aparência e Ação
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-12 gap-5">
        <div class="md:col-span-4">
          <label class="block text-sm font-medium text-gray-600 mb-1">Ícone</label>
          <div class="relative cursor-pointer">
            <q-input
              dense
              outlined
              v-model="form.icone"
              class="rounded-lg bg-white cursor-pointer"
              hide-bottom-space
              readonly
            >
              <template v-slot:prepend>
                <q-icon :name="form.icone || 'help_outline'" class="text-primary" />
              </template>
              <template v-slot:append>
                <q-icon name="arrow_drop_down" />
              </template>
            </q-input>
            <div class="absolute inset-0 z-10 cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <div class="p-3 bg-white w-72 max-h-64 overflow-y-auto grid grid-cols-5 gap-2 rounded-xl shadow-lg border border-gray-100">
                  <div
                    v-for="icon in iconesDisponiveis"
                    :key="icon"
                    @click="form.icone = icon"
                    v-close-popup
                    class="flex items-center justify-center w-11 h-11 rounded-lg cursor-pointer transition-all duration-200"
                    :class="form.icone === icon ? 'bg-blue-100 text-primary shadow-sm border border-blue-200 scale-105' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'"
                    :title="icon"
                  >
                    <q-icon :name="icon" size="sm" />
                  </div>
                </div>
              </q-popup-proxy>
            </div>
          </div>
        </div>

        <div class="md:col-span-4">
          <label class="block text-sm font-medium text-gray-600 mb-1">Rótulo do Botão</label>
          <q-input
            dense
            outlined
            v-model="form.labelAcao"
            placeholder="Acessar"
            class="rounded-lg bg-white"
            hide-bottom-space
          />
        </div>

        <div class="md:col-span-4">
          <label class="block text-sm font-medium text-gray-600 mb-1">Destino do Botão</label>
          <q-input
            dense
            outlined
            v-model="form.urlAcao"
            placeholder="/beneficios ou https://..."
            class="rounded-lg bg-white"
            hint="Rota interna ou link externo"
            hide-bottom-space
          />
        </div>

        <div class="md:col-span-12 flex flex-wrap gap-6">
          <q-toggle
            v-model="form.acessoRapido"
            label="Acesso rápido (destaque na vitrine)"
            color="primary"
            class="font-medium text-gray-700"
          />
          <q-toggle
            v-model="form.ativo"
            label="Ativo (visível na tela pública)"
            color="primary"
            class="font-medium text-gray-700"
          />
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
      <q-btn label="Cancelar" flat color="grey-7" class="rounded-lg font-medium px-4 hover:bg-gray-50" v-close-popup />
      <q-btn icon="check" label="Salvar Serviço" type="submit" color="primary" unelevated :loading="loading" :disable="loading" class="rounded-lg font-medium px-6 shadow-sm shadow-blue-500/30" />
    </div>
  </q-form>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { buscarServico, listarServicos } from 'src/services/servicos/servicosAdminService';

const emits = defineEmits(['submitData']);
const props = defineProps({
  servicoId: { type: String, default: '' },
  loading: { type: Boolean, default: false },
});

const iconesDisponiveis = [
  'apps', 'payments', 'psychology', 'school', 'hub',
  'description', 'assignment', 'work', 'health_and_safety', 'account_balance',
  'support_agent', 'directions_car', 'home', 'receipt_long', 'groups',
  'event', 'gavel', 'build', 'local_hospital', 'menu_book',
];

const form = ref({
  nome: '',
  descricao: '',
  icone: 'apps',
  categoria: '',
  urlAcao: '',
  labelAcao: 'Acessar',
  acessoRapido: false,
  ativo: true,
});

const categoriasPadrao = ['Financeiro', 'Saúde', 'Capacitação', 'Tecnologia', 'Geral'];
const categoriasTodas = ref([...categoriasPadrao]);
const categoriasFiltradas = ref([...categoriasPadrao]);

function filtrarCategorias(val, update) {
  update(() => {
    if (!val) {
      categoriasFiltradas.value = categoriasTodas.value;
      return;
    }
    const termo = val.toLowerCase();
    categoriasFiltradas.value = categoriasTodas.value.filter((c) => c.toLowerCase().includes(termo));
  });
}

function criarCategoria(val, done) {
  const nome = (val || '').trim();
  if (!nome) return;
  if (!categoriasTodas.value.includes(nome)) {
    categoriasTodas.value.push(nome);
  }
  done(nome, 'add-unique');
}

async function loadData() {
  try {
    const res = await listarServicos(1, 200);
    const doBanco = (res.data || []).map((s) => s.categoria).filter(Boolean);
    categoriasTodas.value = [...new Set([...categoriasPadrao, ...doBanco])];
    categoriasFiltradas.value = categoriasTodas.value;
  } catch (e) {
    console.error('Erro ao carregar categorias', e);
  }

  if (!props.servicoId) return;
  try {
    const data = await buscarServico(props.servicoId);
    form.value.nome = data.nome;
    form.value.descricao = data.descricao || '';
    form.value.icone = data.icone || 'apps';
    form.value.categoria = data.categoria || '';
    form.value.urlAcao = data.urlAcao || '';
    form.value.labelAcao = data.labelAcao || 'Acessar';
    form.value.acessoRapido = data.acessoRapido;
    form.value.ativo = data.ativo;
  } catch (e) {
    console.error('Erro ao carregar serviço', e);
  }
}

function sendData() {
  if (props.loading) return; // já enviando — evita duplo submit
  emits('submitData', form.value);
}

onMounted(() => {
  loadData();
});
</script>
