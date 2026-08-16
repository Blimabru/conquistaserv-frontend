<template>
  <div>
    <div class="mb-2 flex flex-nowrap items-center">
      <q-icon :name="icone" color="primary" size="20px" class="mr-2" />
      <div>
        <div class="text-base font-medium">
          {{ titulo }}
          <span class="font-normal text-gray-500">({{ canais.length }})</span>
        </div>
        <div v-if="subtitulo" class="text-xs text-gray-600">{{ subtitulo }}</div>
      </div>
    </div>

    <div v-if="!canais.length" class="p-2 text-xs text-gray-500">
      {{ vazio }}
    </div>

    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <CanalCard
        v-for="canal in canais"
        :key="canal.id"
        :canal="canal"
        :contexto="contexto"
        @abrir="$emit('abrir', canal)"
        @toggle-notificacao="$emit('toggle-notificacao', canal, $event)"
      />
    </div>
  </div>
</template>

<script setup>
import CanalCard from './CanalCard.vue';

defineProps({
  titulo: { type: String, required: true },
  subtitulo: { type: String, default: '' },
  icone: { type: String, default: 'folder' },
  canais: { type: Array, default: () => [] },
  contexto: { type: String, required: true },
  vazio: { type: String, default: 'Nada por aqui.' },
});
defineEmits(['abrir', 'toggle-notificacao']);
</script>
