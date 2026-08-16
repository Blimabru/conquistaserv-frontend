<template>
  <div
    class="flex flex-col justify-between rounded-3xl border border-gray-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-gray-300 h-full"
  >
    <div>
      <!-- Ícone Temático com fundo pastel suave -->
      <div
        class="flex h-12 w-12 items-center justify-center rounded-2xl mb-4 transition-transform hover:scale-105"
        :style="{ backgroundColor: service.iconBg, color: service.iconColor }"
      >
        <q-icon :name="service.icon" size="26px" />
      </div>

      <!-- Título do Serviço -->
      <h3 class="text-base font-bold text-gray-900 leading-snug">
        {{ service.title }}
      </h3>

      <!-- Lista de Itens / Especialidades -->
      <ul class="mt-3 space-y-1.5 text-xs text-gray-600 list-none p-0">
        <li
          v-for="(item, idx) in service.items"
          :key="idx"
          class="flex items-start gap-1.5 leading-tight"
        >
          <span class="text-gray-400 font-bold">•</span>
          <span>{{ item }}</span>
        </li>
      </ul>
    </div>

    <!-- Botões de Ação: Conhecer serviço + Agendar -->
    <div class="mt-6 flex flex-col gap-2 pt-2 border-t border-gray-100">
      <button
        type="button"
        class="w-full rounded-xl py-2 px-3 text-xs font-semibold transition-all border cursor-pointer text-center"
        :style="{
          backgroundColor: service.btnBg,
          color: service.btnTextColor,
          borderColor: service.btnBorder
        }"
        @click="$emit('details', service)"
      >
        Conhecer serviço
      </button>

      <button
        type="button"
        class="w-full rounded-xl bg-[#045DA5] py-2 px-3 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#024881] active:scale-95 border-none cursor-pointer text-center"
        @click="$emit('agendar', service.title)"
      >
        Agendar
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  service: {
    type: Object,
    required: true
  }
})

defineEmits(['details', 'agendar'])
</script>
