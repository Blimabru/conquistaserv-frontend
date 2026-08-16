<template>
  <q-form @submit.prevent.stop="sendData" greedy class="text-gray-700">
    <div class="mb-6">
      <h3 class="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <q-icon name="info" size="20px" class="text-primary" />
        Identificação
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-12 gap-5">
        <div class="md:col-span-8">
          <label class="block text-sm font-medium text-gray-600 mb-1">Título <span class="text-red-500">*</span></label>
          <q-input
            dense
            outlined
            v-model="form.titulo"
            placeholder="Ex: ED-F-005 FOLHA DE PONTO"
            class="rounded-lg bg-gray-50/50"
            :rules="[val => !!val || '*Campo obrigatório']"
            hide-bottom-space
          />
        </div>

        <div class="md:col-span-4">
          <label class="block text-sm font-medium text-gray-600 mb-1">Versão</label>
          <q-input
            dense
            outlined
            v-model="form.versao"
            placeholder="v1.0"
            class="rounded-lg bg-gray-50/50"
            hide-bottom-space
          />
        </div>

        <div class="md:col-span-6">
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
            placeholder="Ex: Administrativo, Educação..."
            class="rounded-lg bg-gray-50/50"
            :rules="[val => !!val || '*Campo obrigatório']"
            hide-bottom-space
          />
        </div>

        <div class="md:col-span-6">
          <label class="block text-sm font-medium text-gray-600 mb-1">Cor da Tag</label>
          <q-input
            dense
            outlined
            v-model="form.corTag"
            placeholder="#E2007A"
            class="rounded-lg bg-gray-50/50"
            hint="Cor hexadecimal (opcional)"
          >
            <template v-slot:append>
              <q-icon name="colorize" class="cursor-pointer" :style="{ color: form.corTag || '#ccc' }">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-color v-model="form.corTag" default-view="palette" no-header no-footer class="rounded-xl shadow-md" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <div class="md:col-span-12">
          <label class="block text-sm font-medium text-gray-600 mb-1">Descrição <span class="text-red-500">*</span></label>
          <q-input
            dense
            outlined
            v-model="form.descricao"
            type="textarea"
            rows="2"
            placeholder="Para que serve este documento?"
            class="rounded-lg bg-gray-50/50"
            :rules="[val => !!val || '*Campo obrigatório']"
            hide-bottom-space
          />
        </div>
      </div>
    </div>

    <q-separator class="my-6 opacity-50" />

    <div class="mb-6 bg-blue-50/30 p-5 rounded-2xl border border-blue-100/50">
      <h3 class="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <q-icon name="attach_file" size="20px" class="text-primary" />
        Arquivo
      </h3>

      <q-file
        v-model="arquivoSelecionado"
        outlined
        dense
        :loading="enviandoArquivo"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
        :label="form.url ? 'Substituir arquivo (PDF, DOC, XLS, PPT — máx. 25MB)' : 'Selecionar arquivo (PDF, DOC, XLS, PPT — máx. 25MB)'"
        class="rounded-lg bg-white mb-3"
        :rules="[() => !!form.url || 'Envie um arquivo']"
        hide-bottom-space
        @update:model-value="handleArquivo"
      >
        <template v-slot:prepend>
          <q-icon name="cloud_upload" class="text-primary" />
        </template>
      </q-file>

      <div v-if="form.url" class="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100 mb-4">
        <q-icon name="description" class="text-primary" size="22px" />
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium text-gray-800 truncate">{{ form.titulo || 'Arquivo enviado' }}</div>
          <div class="text-xs text-gray-500">{{ form.tipo }} · {{ formatarBytes(form.tamanho) }}</div>
        </div>
        <q-btn flat dense no-caps icon="open_in_new" label="Abrir" color="primary" size="sm" @click="window.open(form.url, '_blank')" />
      </div>

      <q-toggle
        v-model="form.ativo"
        label="Ativo (visível na tela pública)"
        color="primary"
        class="font-medium text-gray-700"
      />
    </div>

    <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
      <q-btn label="Cancelar" flat color="grey-7" class="rounded-lg font-medium px-4 hover:bg-gray-50" v-close-popup />
      <q-btn icon="check" label="Salvar Documento" type="submit" color="primary" unelevated :loading="loading" :disable="loading" class="rounded-lg font-medium px-6 shadow-sm shadow-blue-500/30" />
    </div>
  </q-form>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { buscarDocumento, listarDocumentos } from 'src/services/documentos/documentosAdminService';
import { uploadDocumento } from 'src/services/documentos/uploadDocumentoService';

const $q = useQuasar();
const emits = defineEmits(['submitData']);
const props = defineProps({
  documentoId: { type: String, default: '' },
  loading: { type: Boolean, default: false },
});

const form = ref({
  titulo: '',
  versao: 'v1.0',
  descricao: '',
  categoria: '',
  corTag: '',
  url: '',
  tipo: '',
  tamanho: 0,
  ativo: true,
});

const arquivoSelecionado = ref(null);
const enviandoArquivo = ref(false);

function formatarBytes(bytes) {
  if (!bytes) return '0 KB';
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

async function handleArquivo(file) {
  if (!file) return;
  enviandoArquivo.value = true;
  try {
    const res = await uploadDocumento(file);
    form.value.url = res.url;
    form.value.tipo = res.tipo;
    form.value.tamanho = res.tamanho;
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Erro ao enviar arquivo.' });
  } finally {
    enviandoArquivo.value = false;
    arquivoSelecionado.value = null;
  }
}

const categoriasPadrao = ['Administrativo', 'Gratificações', 'Educação', 'Geral'];
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
    const res = await listarDocumentos(1, 200);
    const doBanco = (res.data || []).map((d) => d.categoria).filter(Boolean);
    categoriasTodas.value = [...new Set([...categoriasPadrao, ...doBanco])];
    categoriasFiltradas.value = categoriasTodas.value;
  } catch (e) {
    console.error('Erro ao carregar categorias', e);
  }

  if (!props.documentoId) return;
  try {
    const data = await buscarDocumento(props.documentoId);
    form.value.titulo = data.titulo;
    form.value.versao = data.versao;
    form.value.descricao = data.descricao;
    form.value.categoria = data.categoria;
    form.value.corTag = data.corTag || '';
    form.value.url = data.url;
    form.value.tipo = data.tipo || '';
    form.value.tamanho = data.tamanho || 0;
    form.value.ativo = data.ativo;
  } catch (e) {
    console.error('Erro ao carregar documento', e);
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
