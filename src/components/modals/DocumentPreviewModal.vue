<template>
  <q-dialog
    :model-value="modelValue"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card class="flex flex-col h-full w-full bg-[#F4F7FA]">
      <!-- Barra Superior do Modal -->
      <div
        class="flex items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 py-3 shadow-xs shrink-0"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E5EEF6] text-[#045DA5]"
          >
            <q-icon name="description" size="22px" />
          </div>
          <div class="min-w-0">
            <h2 class="truncate text-sm sm:text-base font-bold text-gray-900 leading-tight">
              {{ document?.title }}
            </h2>
            <span
              v-if="document?.tagLabel || document?.category"
              class="inline-flex items-center rounded-full bg-[#E2007A] px-2.5 py-0.5 text-[10px] font-semibold text-white mt-0.5"
            >
              {{ document?.tagLabel || document?.category }}
            </span>
          </div>
        </div>

        <!-- Ações do Cabeçalho do Modal -->
        <div class="flex items-center gap-2 shrink-0">
          <button
            v-if="document?.url"
            type="button"
            class="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            @click="openInNewTab(document?.url)"
          >
            <q-icon name="open_in_new" size="15px" />
            <span>Abrir em nova aba</span>
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-xl bg-[#045DA5] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#024881] transition-colors cursor-pointer border-none shadow-xs"
            @click="$emit('download', document)"
          >
            <q-icon name="download" size="15px" />
            <span>Baixar</span>
          </button>

          <button
            type="button"
            aria-label="Fechar"
            class="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
            @click="$emit('update:modelValue', false)"
          >
            <q-icon name="close" size="20px" />
          </button>
        </div>
      </div>

      <!-- Corpo do Modal com Visualizador PDF/Drive -->
      <div class="flex-1 p-3 sm:p-5 flex flex-col overflow-hidden">
        <div
          class="flex-1 w-full max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-md bg-white border border-gray-200 relative flex flex-col"
        >
          <iframe
            v-if="document?.url"
            :src="document.url"
            class="w-full h-full border-none flex-1"
            allow="autoplay"
          ></iframe>

          <div
            v-else
            class="flex flex-col items-center justify-center h-full p-8 text-center"
          >
            <q-icon name="info" size="48px" class="text-blue-500 mb-3" />
            <h3 class="text-base font-semibold text-gray-800">Visualização de Documento</h3>
            <p class="mt-1 text-sm text-gray-500 max-w-md">
              Este documento não tem um arquivo disponível para visualização.
            </p>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  document: {
    type: Object,
    default: null
  }
})

defineEmits(['update:modelValue', 'download'])

function openInNewTab(url) {
  if (url) {
    window.open(url, '_blank')
  }
}
</script>
