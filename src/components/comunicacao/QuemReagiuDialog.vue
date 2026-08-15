<template>
  <q-dialog :model-value="modelValue" @update:model-value="fechar">
    <q-card class="min-w-[340px] max-w-[90vw]">
      <q-card-section class="flex flex-nowrap items-center pb-0">
        <div class="text-lg font-medium">Quem reagiu</div>
        <div class="grow" />
        <q-btn icon="close" flat round dense v-close-popup aria-label="Fechar" />
      </q-card-section>

      <q-tabs
        v-model="aba"
        dense
        align="left"
        active-color="primary"
        indicator-color="primary"
        class="text-gray-600"
        no-caps
      >
        <q-tab name="todas" :label="`Todas (${reacoes.length})`" />
        <q-tab
          v-for="g in grupos"
          :key="g.tipo"
          :name="g.tipo"
        >
          <div class="flex flex-nowrap items-center gap-1.5">
            <q-icon :name="g.icone" size="18px" :color="g.cor" />
            <span>{{ g.quantidade }}</span>
          </div>
        </q-tab>
      </q-tabs>

      <q-separator />

      <q-card-section class="max-h-[50vh] overflow-y-auto pt-2">
        <q-list v-if="carregando === false">
          <q-item v-for="(p, i) in listaFiltrada" :key="i">
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white" size="34px">
                {{ iniciais(p.nome) }}
              </q-avatar>
            </q-item-section>
            <q-item-section>{{ p.nome }}</q-item-section>
            <q-item-section side>
              <q-icon
                :name="iconeTipo(p.tipo)"
                size="20px"
                :color="corTipo(p.tipo)"
                :aria-label="labelTipo(p.tipo)"
              />
            </q-item-section>
          </q-item>

          <div
            v-if="!listaFiltrada.length"
            class="py-4 text-center text-gray-500"
          >
            Ninguém reagiu com este tipo ainda.
          </div>
        </q-list>

        <div v-else class="py-4 text-center">
          <q-spinner-dots color="primary" size="32px" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { MAPA_REACAO, reacoesPresentes } from 'src/helpers/comunicacao/reacoes';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  reacoes: { type: Array, default: () => [] }, 
  carregando: { type: Boolean, default: false },
});
const emit = defineEmits(['update:modelValue']);

const aba = ref('todas');

const grupos = computed(() => {
  const agregado = props.reacoes.reduce((acc, r) => {
    acc[r.tipo] = (acc[r.tipo] || 0) + 1;
    return acc;
  }, {});
  return reacoesPresentes(agregado);
});

const listaFiltrada = computed(() => {
  if (aba.value === 'todas') return props.reacoes;
  return props.reacoes.filter((r) => r.tipo === aba.value);
});

function fechar(v) {
  emit('update:modelValue', v);
}
function iniciais(nome = '') {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}
function iconeTipo(tipo) {
  return MAPA_REACAO[tipo]?.icone || 'thumb_up';
}
function corTipo(tipo) {
  return MAPA_REACAO[tipo]?.cor || '';
}
function labelTipo(tipo) {
  return MAPA_REACAO[tipo]?.label || tipo;
}

watch(
  () => props.modelValue,
  (v) => {
    if (v) aba.value = 'todas';
  },
);
</script>
