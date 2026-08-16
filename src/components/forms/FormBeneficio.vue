<template>
  <q-form @submit.prevent.stop="sendData" greedy class="text-gray-700">
    <!-- Bloco 1: Informações Básicas -->
    <div class="mb-6">
      <h3 class="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <q-icon name="info" size="20px" class="text-primary" />
        Informações Básicas
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-12 gap-5">
        <div class="md:col-span-8">
          <label class="block text-sm font-medium text-gray-600 mb-1">Título <span class="text-red-500">*</span></label>
          <q-input
            dense
            outlined
            v-model="form.titulo"
            placeholder="Ex: Plano de Saúde"
            class="rounded-lg bg-gray-50/50"
            :rules="[val => !!val || '*Campo obrigatório']"
            hide-bottom-space
          />
        </div>

        <div class="md:col-span-4">
          <label class="block text-sm font-medium text-gray-600 mb-1">Categoria <span class="text-red-500">*</span></label>
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
            placeholder="Ex: Saúde..."
            class="rounded-lg bg-gray-50/50"
            :rules="[val => !!val || '*Campo obrigatório']"
            hide-bottom-space
          />
        </div>

        <div class="md:col-span-12">
          <label class="block text-sm font-medium text-gray-600 mb-1">Descrição curta (card) <span class="text-red-500">*</span></label>
          <q-input
            dense
            outlined
            v-model="form.descricao"
            placeholder="Resumo de uma linha exibido no card"
            class="rounded-lg bg-gray-50/50"
            :rules="[val => !!val || '*Campo obrigatório']"
            hide-bottom-space
          />
        </div>

        <div class="md:col-span-12">
          <label class="block text-sm font-medium text-gray-600 mb-1">Descrição completa (tela de detalhe)</label>
          <q-input
            dense
            outlined
            type="textarea"
            rows="3"
            v-model="form.descricaoLonga"
            placeholder="Texto completo exibido ao abrir o benefício"
            class="rounded-lg bg-gray-50/50"
            hide-bottom-space
          />
        </div>

        <div class="md:col-span-6">
          <label class="block text-sm font-medium text-gray-600 mb-1">Ícone <span class="text-red-500">*</span></label>
          <div class="relative cursor-pointer">
            <q-input
              dense
              outlined
              v-model="form.icone"
              class="rounded-lg bg-white cursor-pointer"
              :rules="[val => !!val || '*Campo obrigatório']"
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

        <div class="md:col-span-6">
          <label class="block text-sm font-medium text-gray-600 mb-1">Selo (opcional)</label>
          <q-input
            dense
            outlined
            v-model="form.badge"
            placeholder="Ex: Novo"
            class="rounded-lg bg-white"
            hide-bottom-space
          />
        </div>

        <div class="md:col-span-12 bg-orange-50/50 border border-orange-100 rounded-lg px-4 py-3 flex flex-wrap gap-6">
          <div>
            <q-toggle
              v-model="form.destaque"
              label="Destaque no topo (só 1 por vez)"
              color="warning"
              class="font-medium text-gray-700"
            />
          </div>
          <div>
            <q-toggle
              v-model="form.ativo"
              label="Ativo (visível na tela pública)"
              color="primary"
              class="font-medium text-gray-700"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Bloco 2: Listas simples -->
    <q-expansion-item
      icon="checklist"
      label="Procedimentos cobertos"
      header-class="bg-blue-50/50 text-blue-900 font-medium rounded-xl border border-blue-100 transition-colors"
      class="shadow-sm rounded-xl overflow-hidden mb-3"
    >
      <div class="p-4 bg-white border-x border-b border-blue-100 rounded-b-xl">
        <div v-for="(item, i) in form.procedimentos" :key="i" class="flex items-center gap-2 mb-2">
          <q-input dense outlined v-model="form.procedimentos[i]" class="flex-1 rounded-lg" hide-bottom-space />
          <q-btn flat round dense icon="delete" color="negative" size="sm" @click="form.procedimentos.splice(i, 1)" />
        </div>
        <q-btn flat no-caps icon="add" label="Adicionar procedimento" color="primary" size="sm" @click="form.procedimentos.push('')" />
      </div>
    </q-expansion-item>

    <q-expansion-item
      icon="fact_check"
      label="Regras de elegibilidade"
      header-class="bg-blue-50/50 text-blue-900 font-medium rounded-xl border border-blue-100 transition-colors"
      class="shadow-sm rounded-xl overflow-hidden mb-3"
    >
      <div class="p-4 bg-white border-x border-b border-blue-100 rounded-b-xl">
        <div v-for="(item, i) in form.elegibilidade" :key="i" class="flex items-center gap-2 mb-2">
          <q-input dense outlined v-model="form.elegibilidade[i]" class="flex-1 rounded-lg" hide-bottom-space />
          <q-btn flat round dense icon="delete" color="negative" size="sm" @click="form.elegibilidade.splice(i, 1)" />
        </div>
        <q-btn flat no-caps icon="add" label="Adicionar regra" color="primary" size="sm" @click="form.elegibilidade.push('')" />
      </div>
    </q-expansion-item>

    <!-- Bloco 3: Locais -->
    <q-expansion-item
      icon="place"
      label="Locais de atendimento"
      header-class="bg-blue-50/50 text-blue-900 font-medium rounded-xl border border-blue-100 transition-colors"
      class="shadow-sm rounded-xl overflow-hidden mb-3"
    >
      <div class="p-4 bg-white border-x border-b border-blue-100 rounded-b-xl">
        <div
          v-for="(local, i) in form.locais"
          :key="i"
          class="bg-gray-50/80 rounded-2xl p-4 mb-3 border border-gray-100"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <q-input dense outlined label="Nome" v-model="local.name" class="rounded-lg bg-white" hide-bottom-space />
            <q-input dense outlined label="Endereço" v-model="local.address" class="rounded-lg bg-white" hide-bottom-space />
            <q-input dense outlined label="Telefone" v-model="local.phone" class="rounded-lg bg-white" hide-bottom-space />
            <q-input dense outlined label="E-mail" v-model="local.email" class="rounded-lg bg-white" hide-bottom-space />
            <q-input dense outlined label="Horário" v-model="local.hours" class="rounded-lg bg-white md:col-span-2" hide-bottom-space />
          </div>
          <div class="flex justify-end mt-2">
            <q-btn flat no-caps icon="delete" label="Remover local" color="negative" size="sm" @click="form.locais.splice(i, 1)" />
          </div>
        </div>
        <q-btn
          flat no-caps icon="add" label="Adicionar local" color="primary" size="sm"
          @click="form.locais.push({ name: '', address: '', phone: '', email: '', hours: '' })"
        />
      </div>
    </q-expansion-item>

    <!-- Bloco 4: Downloads -->
    <q-expansion-item
      icon="attach_file"
      label="Anexos para download"
      header-class="bg-blue-50/50 text-blue-900 font-medium rounded-xl border border-blue-100 transition-colors"
      class="shadow-sm rounded-xl overflow-hidden mb-3"
      default-opened
    >
      <div class="p-4 bg-white border-x border-b border-blue-100 rounded-b-xl">
        <q-file
          v-model="arquivoSelecionado"
          outlined
          dense
          :loading="enviandoAnexo"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          label="Selecionar arquivo (PDF, DOC, XLS, PPT — máx. 25MB)"
          class="rounded-lg bg-white mb-3"
          @update:model-value="handleAnexo"
        >
          <template v-slot:prepend>
            <q-icon name="cloud_upload" class="text-primary" />
          </template>
        </q-file>

        <div v-if="form.downloads.length" class="flex flex-col gap-2">
          <div
            v-for="(d, i) in form.downloads"
            :key="d.url + i"
            class="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100"
          >
            <q-icon name="description" class="text-primary" size="22px" />
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-800 truncate">{{ d.nome }}</div>
              <div class="text-xs text-gray-500">{{ d.tipo }} · {{ formatarBytes(d.tamanho) }}</div>
            </div>
            <q-btn flat round dense icon="delete" color="negative" size="sm" @click="form.downloads.splice(i, 1)" />
          </div>
        </div>
      </div>
    </q-expansion-item>

    <!-- Botões Finais -->
    <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
      <q-btn label="Cancelar" flat color="grey-7" class="rounded-lg font-medium px-4 hover:bg-gray-50" v-close-popup />
      <q-btn icon="check" label="Salvar Benefício" type="submit" color="primary" unelevated :loading="loading" :disable="loading" class="rounded-lg font-medium px-6 shadow-sm shadow-blue-500/30" />
    </div>
  </q-form>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { buscarBeneficio, listarBeneficios } from 'src/services/beneficios/beneficiosAdminService';
import { uploadAnexo } from 'src/services/beneficios/uploadAnexoService';

const $q = useQuasar();
const emits = defineEmits(['submitData']);
const props = defineProps({
  beneficioId: { type: String, default: '' },
  loading: { type: Boolean, default: false },
});

const iconesDisponiveis = [
  'favorite_border', 'restaurant', 'directions_bus', 'handshake', 'shield', 'percent',
  'local_hospital', 'school', 'home', 'family_restroom', 'fitness_center', 'work',
  'account_balance', 'savings', 'medical_services', 'directions_car', 'sports_bar', 'spa',
];

const form = ref({
  titulo: '',
  descricao: '',
  descricaoLonga: '',
  icone: 'favorite_border',
  categoria: '',
  badge: '',
  destaque: false,
  ativo: true,
  procedimentos: [],
  elegibilidade: [],
  locais: [],
  downloads: [],
});

const categoriasPadrao = ['Saúde', 'Alimentação', 'Transporte', 'Convênios', 'Previdência', 'Geral'];
const categoriasTodas = ref([...categoriasPadrao]);
const categoriasFiltradas = ref([...categoriasPadrao]);
const arquivoSelecionado = ref(null);
const enviandoAnexo = ref(false);

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

function formatarBytes(bytes) {
  if (!bytes) return '0 KB';
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

async function handleAnexo(file) {
  if (!file) return;
  enviandoAnexo.value = true;
  try {
    const res = await uploadAnexo(file);
    form.value.downloads.push({
      nome: res.nome,
      url: res.url,
      tipo: res.tipo,
      tamanho: res.tamanho,
      ordem: form.value.downloads.length,
    });
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Erro ao enviar anexo.' });
  } finally {
    enviandoAnexo.value = false;
    arquivoSelecionado.value = null;
  }
}

async function loadData() {
  try {
    const res = await listarBeneficios(1, 200);
    const doBanco = (res.data || []).map((b) => b.categoria).filter(Boolean);
    categoriasTodas.value = [...new Set([...categoriasPadrao, ...doBanco])];
    categoriasFiltradas.value = categoriasTodas.value;
  } catch (e) {
    console.error('Erro ao carregar categorias', e);
  }

  if (!props.beneficioId) return;
  try {
    const data = await buscarBeneficio(props.beneficioId);
    form.value.titulo = data.titulo;
    form.value.descricao = data.descricao;
    form.value.descricaoLonga = data.descricaoLonga || '';
    form.value.icone = data.icone;
    form.value.categoria = data.categoria;
    form.value.badge = data.badge || '';
    form.value.destaque = data.destaque;
    form.value.ativo = data.ativo;
    form.value.procedimentos = data.procedimentos || [];
    form.value.elegibilidade = data.elegibilidade || [];
    form.value.locais = data.locais || [];
    form.value.downloads = (data.downloads || []).map((d) => ({
      nome: d.nome, url: d.url, tipo: d.tipo, tamanho: d.tamanho, ordem: d.ordem,
    }));
  } catch (e) {
    console.error('Erro ao carregar benefício', e);
  }
}

function sendData() {
  if (props.loading) return; // já enviando — evita duplo submit
  const payload = {
    ...form.value,
    procedimentos: form.value.procedimentos.filter((p) => p.trim()),
    elegibilidade: form.value.elegibilidade.filter((e) => e.trim()),
    locais: form.value.locais.filter((l) => l.name?.trim()),
  };
  emits('submitData', payload);
}

onMounted(() => {
  loadData();
});
</script>
