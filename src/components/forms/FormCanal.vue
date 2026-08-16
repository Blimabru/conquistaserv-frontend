<template>
  <q-form @submit.prevent.stop="sendData" greedy class="text-gray-700">
    <!-- Bloco 1: Identificação -->
    <div class="mb-6">
      <h3 class="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <q-icon name="info" size="20px" class="text-primary" />
        Identificação
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-12 gap-5">
        <div class="md:col-span-6">
          <label class="block text-sm font-medium text-gray-600 mb-1">Nome do Canal <span class="text-red-500">*</span></label>
          <q-input
            dense
            outlined
            v-model="form.nome"
            placeholder="Ex: SECOM, RH, Bem-estar..."
            class="rounded-lg bg-gray-50/50"
            :rules="[val => !!val || '*Campo obrigatório']"
            hide-bottom-space
          />
        </div>

        <div class="md:col-span-6">
          <label class="block text-sm font-medium text-gray-600 mb-1">Descrição <span class="text-red-500">*</span></label>
          <q-input
            dense
            outlined
            v-model="form.descricao"
            placeholder="Para que serve este canal?"
            class="rounded-lg bg-gray-50/50"
            :rules="[val => !!val || '*Campo obrigatório']"
            hide-bottom-space
          />
        </div>
      </div>
    </div>

    <div v-if="secretariaVinculada" class="mb-6 flex items-center gap-2 bg-primary-light border border-primary/20 rounded-lg px-4 py-2 text-sm text-primary">
      <q-icon name="account_balance" size="18px" />
      Canal da secretaria <strong>{{ secretariaVinculada.nome }}</strong> — sempre público e sem
      destaque, gerido por lá.
    </div>

    <q-separator class="my-6 opacity-50" />

    <!-- Bloco 2: Aparência e Visibilidade -->
    <div class="mb-6 bg-blue-50/30 p-5 rounded-2xl border border-blue-100/50">
      <h3 class="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <q-icon name="palette" size="20px" class="text-primary" />
        Aparência e Visibilidade
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-12 gap-5">
        <div class="md:col-span-4">
          <label class="block text-sm font-medium text-gray-600 mb-1">Tipo</label>
          <q-select
            outlined
            dense
            :disable="!!secretariaVinculada"
            v-model="form.tipo"
            :options="[{ label: 'Público', value: 'PUBLICO' }, { label: 'Privado', value: 'PRIVADO' }]"
            emit-value
            map-options
            class="rounded-lg bg-white"
            :hint="secretariaVinculada ? 'Canal de secretaria é sempre público' : 'Privado exige gestão manual de membros'"
            :rules="[val => !!val || '*Campo obrigatório']"
            hide-bottom-space
          />
        </div>

        <div class="md:col-span-4">
          <label class="block text-sm font-medium text-gray-600 mb-1">Cor</label>
          <q-input
            dense
            outlined
            v-model="form.cor"
            placeholder="#3b82f6"
            class="rounded-lg bg-white"
            hint="Cor hexadecimal"
            :rules="[val => !!val || '*Campo obrigatório']"
            hide-bottom-space
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

        <div class="md:col-span-4">
          <label class="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
            Ícone
            <q-icon name="help_outline" size="15px" class="text-gray-400 cursor-help">
              <q-tooltip class="bg-gray-800 text-xs shadow-4 border border-gray-700" style="font-size: 11px;">
                Para usar outros ícones, acesse <b>fonts.google.com/icons</b><br>
                e digite o nome exato do ícone (ex: "favorite")<br>
                e pressione "Enter" para adicionar.
              </q-tooltip>
            </q-icon>
          </label>
          <q-select
            dense
            outlined
            v-model="form.icone"
            :options="iconOptions"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            new-value-mode="add-unique"
            @filter="filterIcons"
            class="rounded-lg bg-white"
            hint="Nome de Material Icon"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" dense>
                <q-item-section avatar>
                  <q-icon :name="scope.opt" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-sm">{{ scope.opt }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:append>
              <q-icon :name="form.icone || 'help_outline'" />
            </template>
          </q-select>
        </div>

        <div class="md:col-span-12">
          <q-toggle
            v-model="form.oficial"
            :disable="!!secretariaVinculada"
            label="Canal Principal (destaque no topo do feed)"
            color="primary"
            class="font-medium text-gray-700"
          />
          <p class="text-xs text-gray-500 mt-1 ml-1">
            Só pode haver um canal principal por vez — marcar este substitui o anterior automaticamente.
          </p>
        </div>
      </div>
    </div>

    <!-- Bloco 3: Membros (só canal privado já existente) -->
    <template v-if="canalId && form.tipo === 'PRIVADO'">
      <q-separator class="my-6 opacity-50" />
      <div class="mb-2">
        <h3 class="text-base font-semibold text-gray-800 mb-1 flex items-center gap-2">
          <q-icon name="group" size="20px" class="text-primary" />
          Membros do Canal
        </h3>
        <p class="text-sm text-gray-500 mb-4">
          Canal privado — só quem está nesta lista tem acesso ao conteúdo.
        </p>
        <GerenciarMembrosCanal :canalId="canalId" />
      </div>
    </template>

    <!-- Botões Finais -->
    <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
      <q-btn label="Cancelar" flat color="grey-7" class="rounded-lg font-medium px-4 hover:bg-gray-50" v-close-popup />
      <q-btn icon="check" label="Salvar Canal" type="submit" color="primary" unelevated :loading="loading" :disable="loading" class="rounded-lg font-medium px-6 shadow-sm shadow-blue-500/30" />
    </div>
  </q-form>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { buscarCanal } from 'src/services/comunicacao/canaisAdminService';
import GerenciarMembrosCanal from 'components/comunicacao/GerenciarMembrosCanal.vue';

const emits = defineEmits(['submitData']);
const props = defineProps({
  canalId: { type: String, default: '' },
  loading: { type: Boolean, default: false },
});

const allIcons = [
  'campaign', 'groups', 'star', 'event', 'work', 
  'code', 'health_and_safety', 'palette', 'warning', 'info', 
  'forum', 'local_activity', 'sports', 'menu_book', 'school', 
  'directions_car', 'favorite', 'thumb_up', 'emoji_events', 'article',
  'newspaper', 'tips_and_updates', 'gavel', 'map', 'restaurant',
  'account_balance', 'local_police', 'engineering', 'eco', 'directions_bus',
  'monetization_on', 'public', 'family_restroom', 'handshake', 'business'
];
const iconOptions = ref([...allIcons]);

function filterIcons(val, update) {
  update(() => {
    if (val === '') {
      iconOptions.value = allIcons;
    } else {
      const needle = val.toLowerCase();
      iconOptions.value = allIcons.filter(
        v => v.toLowerCase().includes(needle)
      );
    }
  });
}

const form = ref({
  nome: '',
  descricao: '',
  tipo: 'PUBLICO',
  cor: '#2196f3',
  icone: 'campaign',
  oficial: false,
});

const secretariaVinculada = ref(null);

async function loadData() {
  if (!props.canalId) return;
  try {
    const data = await buscarCanal(props.canalId);
    form.value.nome = data.nome;
    form.value.descricao = data.descricao;
    form.value.tipo = data.tipo;
    form.value.cor = data.cor;
    form.value.icone = data.icone;
    form.value.oficial = data.oficial;
    secretariaVinculada.value = data.secretaria || null;
  } catch (e) {
    console.error('Erro ao carregar canal', e);
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
