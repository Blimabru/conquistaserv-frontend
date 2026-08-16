<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" transition-show="scale" transition-hide="scale">
    <q-card class="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
      <div class="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
        <div class="flex items-center gap-3">
          <div
            class="flex h-11 w-11 items-center justify-center rounded-2xl"
            :style="{ backgroundColor: item?.iconBg || '#E5EEF6', color: item?.iconColor || '#045DA5' }"
          >
            <q-icon :name="item?.icon || 'info'" size="26px" />
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900 leading-tight">
              {{ item?.title }}
            </h2>
            <span v-if="item?.subtitle" class="text-xs font-semibold text-[#045DA5]">
              {{ item?.subtitle }}
            </span>
          </div>
        </div>

        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
          @click="$emit('update:modelValue', false)"
        >
          <q-icon name="close" size="20px" />
        </button>
      </div>

      <p class="text-xs md:text-sm text-gray-700 leading-relaxed">
        {{ item?.longDescription || item?.description }}
      </p>

      <div v-if="item?.items" class="mt-4 rounded-2xl bg-slate-50 p-4 border border-slate-100">
        <h4 class="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Serviços e Atividades Integradas:</h4>
        <ul class="space-y-1.5 text-xs text-gray-600 list-none p-0 m-0">
          <li v-for="(it, idx) in item.items" :key="idx" class="flex items-center gap-2">
            <q-icon name="check_circle" size="16px" class="text-emerald-600 shrink-0" />
            <span>{{ it }}</span>
          </li>
        </ul>
      </div>

      <div class="mt-6 flex items-center justify-end gap-2">
        <button
          type="button"
          class="rounded-xl bg-[#045DA5] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#024881] border-none cursor-pointer"
          @click="$emit('agendar', item?.title); $emit('update:modelValue', false)"
        >
          Agendar Atendimento nesta Área
        </button>
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
  item: {
    type: Object,
    default: null
  }
})

defineEmits(['update:modelValue', 'agendar'])
</script>
