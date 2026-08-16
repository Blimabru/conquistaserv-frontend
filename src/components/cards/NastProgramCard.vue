<template>
  <div
    class="flex flex-col justify-between rounded-3xl border border-gray-200/90 bg-white p-6 shadow-xs transition-all duration-200 hover:shadow-md hover:border-gray-300 h-full"
  >
    <div>
      <!-- Topo do Card: Ícone e Títulos -->
      <div class="flex items-center gap-3.5 mb-3">
        <div
          class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-2xs"
          :style="{ backgroundColor: program.iconBg }"
        >
          <q-icon :name="program.icon" size="26px" :style="{ color: program.iconColor }" />
        </div>

        <div class="min-w-0 flex-1">
          <h3 class="text-base font-bold text-gray-900 leading-tight">
            {{ program.title }}
          </h3>
          <span class="text-xs font-semibold leading-tight block mt-0.5" :style="{ color: program.subtitleColor }">
            {{ program.subtitle }}
          </span>
        </div>
      </div>

      <!-- Descrição -->
      <p class="mt-3 text-xs md:text-sm text-gray-600 leading-relaxed line-clamp-3">
        {{ program.description }}
      </p>

      <!-- Informações de Público e Próxima Atividade -->
      <div class="mt-4 rounded-2xl bg-slate-50 p-3 text-xs space-y-1.5 border border-slate-100">
        <div class="flex items-center gap-1.5 text-gray-700">
          <span class="font-bold text-gray-900">Público:</span>
          <span>{{ program.targetAudience }}</span>
        </div>
        <div class="flex items-center gap-1.5 text-gray-700">
          <span class="font-bold text-gray-900">Próxima atividade:</span>
          <span class="font-medium text-[#045DA5]">{{ program.nextActivity }}</span>
        </div>
      </div>
    </div>

    <!-- Botão de Ação -->
    <div class="mt-5 pt-2">
      <button
        type="button"
        class="w-full rounded-xl bg-[#045DA5] py-2.5 px-4 text-xs md:text-sm font-bold text-white shadow-xs transition-all hover:bg-[#024881] active:scale-95 border-none cursor-pointer text-center"
        @click="$emit('details', program)"
      >
        Conhecer programa
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  program: {
    type: Object,
    required: true
  }
})

defineEmits(['details'])
</script>
