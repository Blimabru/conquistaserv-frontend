<template>
  <div class="w-full rounded-3xl bg-[#045DA5] p-5 md:p-6 text-white shadow-md">
    <!-- Cabeçalho -->
    <div class="text-center">
      <h2 class="text-lg md:text-xl font-bold tracking-tight text-white">
        Mais acessados
      </h2>
      <p class="mt-1 text-xs text-white/80 font-normal">
        Ultimos documentos baixados
      </p>
    </div>

    <!-- Lista de Documentos Recentes -->
    <div class="mt-5 flex flex-col gap-3">
      <div
        v-for="(doc, index) in documents"
        :key="index"
        class="rounded-2xl bg-[#024479] p-4 border border-white/10 shadow-xs transition-all hover:bg-[#023b6b] cursor-pointer"
        @click="$emit('view', doc)"
      >
        <!-- Topo: Título e Tempo perfeitamente alinhados -->
        <div class="flex items-start justify-between gap-3">
          <h3 class="flex-1 min-w-0 text-xs md:text-sm font-bold text-white leading-snug break-words">
            {{ doc.title }}
          </h3>
          <span class="shrink-0 text-[11px] text-white/60 font-normal whitespace-nowrap pt-0.5">
            {{ doc.time || doc.date || '10 min atrás' }}
          </span>
        </div>

        <!-- Descrição -->
        <p class="mt-1.5 text-xs text-white/80 leading-relaxed line-clamp-2">
          {{ doc.description }}
        </p>

        <!-- Rodapé do Card Recente -->
        <div class="mt-4 flex items-center justify-between pt-0.5">
          <span
            class="inline-flex items-center rounded-full bg-[#E2007A] px-2.5 py-0.5 text-[10px] font-semibold text-white tracking-wide whitespace-nowrap"
          >
            {{ doc.tagLabel || doc.category || 'Administrativo' }}
          </span>

          <div class="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              title="Baixar documento recente"
              aria-label="Baixar documento recente"
              class="flex h-6 w-6 items-center justify-center rounded-full bg-[#045DA5] text-white shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
              @click.stop="$emit('download', doc)"
            >
              <q-icon name="download" size="13px" />
            </button>

            <button
              type="button"
              title="Visualizar documento recente"
              aria-label="Visualizar documento recente"
              class="flex h-6 w-6 items-center justify-center rounded-full bg-[#045DA5] text-white shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
              @click.stop="$emit('view', doc)"
            >
              <q-icon name="visibility" size="13px" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  documents: {
    type: Array,
    required: true
  }
})

defineEmits(['download', 'view'])
</script>