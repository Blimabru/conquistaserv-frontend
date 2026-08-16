<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" transition-show="scale" transition-hide="scale">
    <q-card class="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
      <!-- Topo do Modal -->
      <div class="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-[#045DA5]">
            <q-icon name="calendar_month" size="26px" />
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900 leading-tight">
              Agendar Atendimento — NAST
            </h2>
            <p class="text-xs text-gray-500">Preencha os dados para solicitar seu atendimento</p>
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

      <!-- Formulário de Agendamento -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">
            Área / Especialidade Desejada *
          </label>
          <select
            v-model="form.servico"
            required
            class="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-xs md:text-sm text-gray-800 outline-none focus:border-[#045DA5] focus:ring-2 focus:ring-[#045DA5]/20"
          >
            <option value="" disabled>Selecione o serviço...</option>
            <option value="Psicologia">Psicologia (Saúde Mental)</option>
            <option value="Psiquiatria">Psiquiatria (Saúde Mental)</option>
            <option value="Medicina do Trabalho">Medicina do Trabalho (Saúde Ocupacional)</option>
            <option value="Fisioterapia">Fisioterapia (Saúde e Bem-Estar)</option>
            <option value="Serviço Social">Serviço Social (Acolhimento e Orientações)</option>
            <option value="Segurança do Trabalho">Segurança do Trabalho & Ergonomia</option>
          </select>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">
              Data de Preferência *
            </label>
            <input
              v-model="form.data"
              type="date"
              required
              class="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-xs md:text-sm text-gray-800 outline-none focus:border-[#045DA5]"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">
              Turno Preferencial *
            </label>
            <select
              v-model="form.turno"
              required
              class="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-xs md:text-sm text-gray-800 outline-none focus:border-[#045DA5]"
            >
              <option value="Manhã (08:00 às 12:00)">Manhã (08:00 às 12:00)</option>
              <option value="Tarde (13:30 às 17:00)">Tarde (13:30 às 17:00)</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">
            Secretaria / Local de Lotação
          </label>
          <input
            v-model="form.secretaria"
            type="text"
            placeholder="Ex: SEMED, SMS, SEMOB..."
            class="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-xs md:text-sm text-gray-800 outline-none focus:border-[#045DA5]"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">
            Observações ou Motivo Breve
          </label>
          <textarea
            v-model="form.observacao"
            rows="3"
            placeholder="Descreva brevemente sua solicitação ou necessidade..."
            class="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-xs md:text-sm text-gray-800 outline-none focus:border-[#045DA5]"
          ></textarea>
        </div>

        <div class="pt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            class="rounded-xl px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
            @click="$emit('update:modelValue', false)"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="rounded-xl bg-[#045DA5] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#024881] active:scale-95 border-none cursor-pointer"
          >
            Confirmar Solicitação
          </button>
        </div>
      </form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  initialService: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const form = ref({
  servico: '',
  data: '',
  turno: 'Manhã (08:00 às 12:00)',
  secretaria: '',
  observacao: ''
})

watch(() => props.initialService, (newVal) => {
  if (newVal) {
    form.value.servico = newVal
  }
}, { immediate: true })

function handleSubmit() {
  emit('confirm', { ...form.value })
  emit('update:modelValue', false)
  form.value = {
    servico: '',
    data: '',
    turno: 'Manhã (08:00 às 12:00)',
    secretaria: '',
    observacao: ''
  }
}
</script>
