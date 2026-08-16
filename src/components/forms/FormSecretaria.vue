<template>
  <q-form @submit.prevent.stop="sendData" greedy class="text-gray-700">
    <div class="mb-6">
      <h3 class="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <q-icon name="account_balance" size="20px" class="text-primary" />
        Identificação
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Nome da Secretaria <span class="text-red-500">*</span></label>
          <q-input
            dense
            outlined
            v-model="form.nome"
            placeholder="Ex: Secretaria de Saúde"
            class="rounded-lg bg-gray-50/50"
            :rules="[val => !!val || '*Campo obrigatório']"
            hide-bottom-space
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Descrição <span class="text-red-500">*</span></label>
          <q-input
            dense
            outlined
            v-model="form.descricao"
            placeholder="Para que serve essa secretaria?"
            class="rounded-lg bg-gray-50/50"
            :rules="[val => !!val || '*Campo obrigatório']"
            hide-bottom-space
          />
        </div>
      </div>
    </div>

    <!-- Aparência do canal — só na criação, o canal nasce junto e não é editável depois aqui -->
    <div v-if="!secretariaId" class="mb-6 bg-blue-50/30 p-5 rounded-2xl border border-blue-100/50">
      <h3 class="text-base font-semibold text-gray-800 mb-1 flex items-center gap-2">
        <q-icon name="palette" size="20px" class="text-primary" />
        Canal da Secretaria
      </h3>
      <p class="text-sm text-gray-500 mb-4">
        Criado automaticamente junto com a secretaria — sempre público, sem gestão separada.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Cor</label>
          <q-input
            dense
            outlined
            v-model="form.cor"
            placeholder="#045DA5"
            class="rounded-lg bg-white"
            hint="Cor hexadecimal"
          >
            <template v-slot:append>
              <q-icon name="colorize" class="cursor-pointer" :style="{ color: form.cor }">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-color v-model="form.cor" default-view="palette" no-header no-footer class="rounded-xl shadow-md" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Ícone</label>
          <q-input
            dense
            outlined
            v-model="form.icone"
            placeholder="account_balance"
            class="rounded-lg bg-white"
            hint="Nome de Material Icon"
          >
            <template v-slot:append>
              <q-icon :name="form.icone || 'help_outline'" />
            </template>
          </q-input>
        </div>
      </div>
    </div>

    <!-- Canal vinculado — só leitura na edição -->
    <div v-else-if="canalVinculado" class="mb-6 bg-gray-50 p-5 rounded-2xl border border-gray-100 flex items-center gap-3">
      <q-avatar :style="{ backgroundColor: canalVinculado.cor }" text-color="white" :icon="canalVinculado.icone" size="40px" />
      <div>
        <div class="text-sm font-medium text-gray-800">{{ canalVinculado.nome }}</div>
        <div class="text-xs text-gray-500">Canal desta secretaria — edite aparência em Gerenciar Canais.</div>
      </div>
    </div>

    <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
      <q-btn label="Cancelar" flat color="grey-7" class="rounded-lg font-medium px-4 hover:bg-gray-50" v-close-popup />
      <q-btn icon="check" label="Salvar Secretaria" type="submit" color="primary" unelevated :loading="loading" :disable="loading" class="rounded-lg font-medium px-6 shadow-sm shadow-blue-500/30" />
    </div>
  </q-form>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { buscarSecretaria } from 'src/services/comunicacao/secretariasAdminService';

const emits = defineEmits(['submitData']);
const props = defineProps({
  secretariaId: { type: String, default: '' },
  loading: { type: Boolean, default: false },
});

const form = ref({
  nome: '',
  descricao: '',
  cor: '#045DA5',
  icone: 'account_balance',
});

const canalVinculado = ref(null);

async function loadData() {
  if (!props.secretariaId) return;
  try {
    const data = await buscarSecretaria(props.secretariaId);
    form.value.nome = data.nome;
    form.value.descricao = data.descricao;
    canalVinculado.value = data.canal || null;
  } catch (e) {
    console.error('Erro ao carregar secretaria', e);
  }
}

function sendData() {
  if (props.loading) return; // já enviando — evita duplo submit
  if (props.secretariaId) {
    emits('submitData', { nome: form.value.nome, descricao: form.value.descricao });
  } else {
    emits('submitData', { ...form.value });
  }
}

onMounted(() => {
  loadData();
});
</script>
