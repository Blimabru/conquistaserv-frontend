<template>
  <q-form @submit.prevent.stop="sendData" greedy class="text-gray-700">
    <!-- Bloco 1: Informações Básicas -->
    <div class="mb-6">
      <h3 class="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <q-icon name="info" size="20px" class="text-primary" />
        Informações Básicas
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-12 gap-5">
        <div class="md:col-span-6">
          <label class="block text-sm font-medium text-gray-600 mb-1">Canal de Destino <span class="text-red-500">*</span></label>
          <q-select
            outlined
            dense
            v-model="form.canalId"
            :options="canaisOptions"
            emit-value
            map-options
            placeholder="Selecione o canal"
            class="rounded-lg bg-gray-50/50"
            :rules="[val => !!val || '*Campo obrigatório']"
            hide-bottom-space
          />
        </div>

        <div class="md:col-span-4">
          <label class="block text-sm font-medium text-gray-600 mb-1">Prioridade</label>
          <q-input
            dense
            outlined
            v-model.number="form.prioridade"
            type="number"
            min="0"
            placeholder="0"
            class="rounded-lg bg-gray-50/50"
            hint="Maior valor = Fixado no topo"
            hide-bottom-space
          />
        </div>

        <div v-if="canalEhSecretaria" class="md:col-span-12 bg-orange-50/50 border border-orange-100 rounded-lg px-4 py-2">
          <q-toggle
            v-model="form.privada"
            label="Publicação privada (só quem é da secretaria vê)"
            color="warning"
            class="font-medium text-gray-700"
          />
          <p class="text-xs text-gray-500 ml-1">
            Público que não é dessa secretaria continua vendo o canal, mas não essa publicação.
          </p>
        </div>

        <div class="md:col-span-12">
          <label class="block text-sm font-medium text-gray-600 mb-1">Título da Publicação <span class="text-red-500">*</span></label>
          <q-input
            dense
            outlined
            v-model="form.titulo"
            placeholder="Digite um título chamativo..."
            class="rounded-lg bg-gray-50/50"
            :rules="[val => !!val || '*Campo obrigatório']"
            hide-bottom-space
          />
        </div>

        <div class="md:col-span-12">
          <label class="block text-sm font-medium text-gray-600 mb-1">Resumo (Subtítulo) <span class="text-red-500">*</span></label>
          <q-input
            dense
            outlined
            v-model="form.resumo"
            type="textarea"
            rows="2"
            placeholder="Aparece nos cards e notificações curtas..."
            class="rounded-lg bg-gray-50/50"
            :rules="[val => !!val || '*Campo obrigatório']"
            hide-bottom-space
          />
        </div>
      </div>
    </div>

    <q-separator class="my-6 opacity-50" />

    <!-- Bloco 2: Conteúdo -->
    <div class="mb-6">
      <h3 class="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <q-icon name="subject" size="20px" class="text-primary" />
        Conteúdo da Publicação
      </h3>
      <q-editor
        v-model="form.corpo"
        min-height="16rem"
        class="border-gray-200 shadow-sm rounded-lg overflow-hidden"
        :toolbar="[
          ['bold', 'italic', 'strike', 'underline'],
          ['quote', 'unordered', 'ordered'],
          ['undo', 'redo']
        ]"
      />
    </div>

    <!-- Bloco 3: Mídias -->
    <div class="mb-6 bg-blue-50/30 p-5 rounded-2xl border border-blue-100/50">
      <h3 class="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <q-icon name="perm_media" size="20px" class="text-primary" />
        Mídias Anexas
      </h3>
      <q-file
        v-model="arquivosSelecionados"
        outlined
        dense
        multiple
        append
        :loading="enviandoMidia"
        accept=".jpg,.jpeg,.png,.webp,.gif,.mp4,.webm"
        label="Selecionar imagens ou vídeos (máx. 25MB cada)"
        class="rounded-lg bg-white"
        @update:model-value="handleFiles"
      >
        <template v-slot:prepend>
          <q-icon name="cloud_upload" class="text-primary" />
        </template>
      </q-file>

      <div v-if="form.midias.length" class="flex flex-wrap gap-4 mt-4">
        <div
          v-for="(m, i) in form.midias"
          :key="m.url"
          class="group relative w-28 h-28 rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow"
        >
          <img v-if="m.tipo === 'imagem'" :src="m.url" :alt="`Mídia ${i + 1} da publicação`" class="w-full h-full object-cover transition-transform group-hover:scale-105" />
          <div v-else class="w-full h-full flex items-center justify-center bg-gray-50">
            <q-icon name="play_circle_filled" size="40px" class="text-gray-500" />
          </div>
          <button
            type="button"
            class="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 hover:bg-red-500 transition-all backdrop-blur-sm"
            :aria-label="`Remover mídia ${i + 1}`"
            @click="removerMidia(i)"
          >
            <q-icon name="close" size="14px" />
          </button>
        </div>
      </div>
    </div>

    <!-- Bloco 4: Engajamento -->
    <div class="mb-6">
      <h3 class="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <q-icon name="thumbs_up_down" size="20px" class="text-primary" />
        Engajamento & Feedback
      </h3>
      
      <div class="bg-gray-50/50 p-1 rounded-xl border border-gray-100 mb-4">
        <q-toggle
          v-model="form.reacoesHabilitadas"
          label="Permitir que usuários reajam (Curtir, Amei, etc)"
          color="primary"
          class="font-medium text-gray-700"
        />
      </div>

      <q-expansion-item
        icon="poll"
        label="Adicionar Pesquisa de Satisfação (Opcional)"
        header-class="bg-blue-50/50 text-blue-900 font-medium rounded-xl border border-blue-100 transition-colors"
        class="shadow-sm rounded-xl overflow-hidden"
      >
        <div class="grid grid-cols-1 md:grid-cols-12 gap-5 p-5 bg-white border-x border-b border-blue-100 rounded-b-xl">
          <div class="md:col-span-8">
            <label class="block text-sm font-medium text-gray-600 mb-1">Pergunta da Pesquisa</label>
            <q-input
              dense
              outlined
              v-model="form.pesquisa.pergunta"
              placeholder="Ex: O que achou desta novidade?"
              class="rounded-lg"
              hide-bottom-space
            />
          </div>
          
          <div class="md:col-span-4">
            <label class="block text-sm font-medium text-gray-600 mb-1">Escala (Máx)</label>
            <q-input
              dense
              outlined
              v-model.number="form.pesquisa.escala"
              type="number"
              min="3"
              max="10"
              class="rounded-lg"
              hide-bottom-space
            />
          </div>
          
          <div class="md:col-span-12 flex items-center">
            <q-toggle 
              v-model="form.pesquisa.permiteComentario" 
              label="Permitir comentários abertos nas respostas" 
              color="primary"
              class="text-sm font-medium text-gray-600"
            />
          </div>
        </div>
      </q-expansion-item>
    </div>

    <!-- Botões Finais -->
    <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
      <q-btn label="Cancelar" flat color="grey-7" class="rounded-lg font-medium px-4 hover:bg-gray-50" v-close-popup />
      <q-btn icon="check" label="Salvar Publicação" type="submit" color="primary" unelevated :loading="loading" :disable="loading" class="rounded-lg font-medium px-6 shadow-sm shadow-blue-500/30" />
    </div>
  </q-form>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { buscarPublicacao } from 'src/services/comunicacao/publicacoesAdminService';
import { listarCanais } from 'src/services/comunicacao/canaisAdminService';
import { uploadMidia } from 'src/services/comunicacao/uploadService';

const $q = useQuasar();
const emits = defineEmits(['submitData']);
const props = defineProps({
  publicacaoId: { type: String, default: '' },
  loading: { type: Boolean, default: false },
});

const canaisOptions = ref([]);
const canaisRaw = ref([]);
const arquivosSelecionados = ref(null);
const enviandoMidia = ref(false);

const form = ref({
  canalId: '',
  titulo: '',
  resumo: '',
  corpo: '',
  prioridade: 0,
  reacoesHabilitadas: true,
  privada: false,
  midias: [],
  pesquisa: { pergunta: '', escala: 5, permiteComentario: true },
});

// Canal de secretaria é o único contexto onde faz sentido escolher privada/pública.
const canalEhSecretaria = computed(() => {
  const canal = canaisRaw.value.find((c) => c.id === form.value.canalId);
  return !!canal?.secretaria;
});

async function handleFiles(files) {
  if (!files) return;
  const lista = Array.isArray(files) ? files : [files];
  enviandoMidia.value = true;
  try {
    for (const arquivo of lista) {
      const res = await uploadMidia(arquivo);
      form.value.midias.push({
        tipo: res.tipo,
        url: res.url,
        ordem: form.value.midias.length,
      });
    }
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Erro ao enviar mídia.' });
  } finally {
    enviandoMidia.value = false;
    arquivosSelecionados.value = null;
  }
}

function removerMidia(index) {
  form.value.midias.splice(index, 1);
  form.value.midias.forEach((m, idx) => { m.ordem = idx; });
}

async function loadData() {
  try {
    const res = await listarCanais(1, 100);
    canaisRaw.value = res.data;
    canaisOptions.value = res.data.map(c => ({
      label: c.secretaria ? `${c.nome} (Secretaria: ${c.secretaria.nome})` : c.nome,
      value: c.id,
    }));

    if (props.publicacaoId) {
      const p = await buscarPublicacao(props.publicacaoId);
      form.value.canalId = p.canalId;
      form.value.titulo = p.titulo;
      form.value.resumo = p.resumo;
      form.value.corpo = p.corpo;
      form.value.prioridade = p.prioridade;
      form.value.reacoesHabilitadas = p.reacoesHabilitadas;
      form.value.privada = p.privada || false;
      form.value.midias = p.midias || [];
      if (p.pesquisa) {
        form.value.pesquisa = p.pesquisa;
      }
    }
  } catch (e) {
    console.error(e);
  }
}

function sendData() {
  if (props.loading) return; // já enviando — evita duplo submit
  const payload = { ...form.value };
  if (!canalEhSecretaria.value) {
    payload.privada = false; // sem efeito em canal geral, mantém consistente
  }
  if (!payload.pesquisa.pergunta) {
    delete payload.pesquisa; // Remove pesquisa se deixada em branco
  }
  emits('submitData', payload);
}

onMounted(() => {
  loadData();
});
</script>
