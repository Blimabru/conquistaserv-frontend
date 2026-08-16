<template>
  <div
    class="flex h-full flex-col justify-between rounded-2xl border border-gray-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-gray-300 cursor-pointer"
    @click="$emit('view')"
  >
    <!-- Topo: Título e Versão alinhados na mesma linha -->
    <div>
      <div class="flex items-start justify-between gap-3">
        <h3 class="flex-1 min-w-0 text-sm md:text-base font-bold text-gray-900 leading-snug break-words">
          {{ title }}
        </h3>
        <span v-if="version" class="shrink-0 text-xs font-normal text-gray-500 whitespace-nowrap pt-0.5">
          {{ version }}
        </span>
      </div>

      <!-- Descrição -->
      <p class="mt-2 text-xs leading-relaxed text-gray-500 line-clamp-2">
        {{ description }}
      </p>
    </div>

    <!-- Rodapé: Tag à esquerda e Botões à direita -->
    <div class="mt-5 flex items-center justify-between gap-2 pt-1">
      <!-- Tag / Badge à esquerda -->
      <div>
        <span
          v-if="tagLabel || category"
          class="inline-flex items-center rounded-full bg-[#E2007A] px-3 py-0.5 text-[11px] font-semibold text-white tracking-wide whitespace-nowrap"
        >
          {{ tagLabel || category }}
        </span>
      </div>

      <!-- Botões de Ação à direita -->
      <div class="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          title="Baixar documento"
          aria-label="Baixar documento"
          class="flex h-7 w-7 items-center justify-center rounded-full bg-[#045DA5] text-white shadow-xs transition-all hover:scale-105 hover:bg-[#024881] active:scale-95 cursor-pointer border-none"
          @click.stop="$emit('download')"
        >
          <q-icon name="download" size="16px" />
        </button>

        <button
          type="button"
          title="Visualizar documento"
          aria-label="Visualizar documento"
          class="flex h-7 w-7 items-center justify-center rounded-full bg-[#045DA5] text-white shadow-xs transition-all hover:scale-105 hover:bg-[#024881] active:scale-95 cursor-pointer border-none"
          @click.stop="$emit('view')"
        >
          <q-icon name="visibility" size="16px" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  version: {
    type: String,
    default: 'v1.0'
  },
  tagLabel: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: ''
  },
  tagColor: {
    type: String,
    default: '#E2007A'
  }
})

defineEmits(['download', 'view'])
</script>