<template>
  <div class="mx-auto max-w-[1280px] pb-12 animate-fade-in">
    <!-- Barra Superior de Navegação (Voltar) -->
    <div class="mb-6 flex items-center">
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-primary shadow-xs transition-all hover:bg-gray-50 hover:border-primary active:scale-95 cursor-pointer"
        @click="$emit('back')"
      >
        <q-icon name="arrow_back" size="18px" />
        <span>Voltar para Benefícios</span>
      </button>
    </div>

    <!-- Banner Principal do Benefício -->
    <div class="mb-8 overflow-hidden rounded-3xl bg-primary p-6 md:p-10 text-white shadow-lg relative">
      <!-- Ícone decorativo de fundo (maior e à direita) -->
      <div class="absolute -right-12 top-1/2 -translate-y-1/2 text-white/10 pointer-events-none select-none hidden md:block">
        <q-icon :name="benefit?.icon || 'loyalty'" size="280px" />
      </div>

      <div class="relative z-10 max-w-3xl">
        <div class="flex flex-wrap items-center gap-2 mb-3">
          <span class="inline-flex items-center rounded-full bg-white/20 backdrop-blur-xs px-3 py-1 text-xs font-semibold text-white tracking-wide border border-white/20">
            {{ benefit?.category || 'Serviço Municipal' }}
          </span>
          <span v-if="benefit?.badge" class="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-white tracking-wide">
            {{ benefit.badge }}
          </span>
        </div>

        <h1 class="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight !m-0 !p-0">
          {{ benefit?.title }} — Detalhes do Benefício
        </h1>

        <p class="mt-3 text-sm md:text-base text-white/90 leading-relaxed font-normal !mb-0">
          {{ benefit?.longDescription || benefit?.description }}
        </p>
      </div>
    </div>

    <!-- Grid de Informações Detalhadas -->
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">

      <!-- Coluna Principal (2/3): Procedimentos e Elegibilidade -->
      <div class="space-y-8 lg:col-span-2">

        <!-- Card: Procedimentos Cobertos / Regras de Utilização -->
        <div class="rounded-3xl border border-gray-200 bg-white p-6 md:p-8 shadow-xs">
          <!-- Cabeçalho alinhado e compacto -->
          <div class="flex items-center gap-3.5 mb-5 border-b border-gray-100 pb-4">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-primary">
              <q-icon name="checklist" size="24px" />
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="section-title text-base md:text-lg font-semibold text-gray-900">
                Procedimentos Cobertos & Regras de Utilização
              </h2>
              <p class="section-subtitle text-xs text-gray-500">
                Confira a lista de coberturas e diretrizes de uso
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div
              v-for="(item, idx) in proceduresList"
              :key="idx"
              class="flex items-start gap-3 rounded-2xl bg-slate-50/80 p-3.5 border border-slate-100"
            >
              <q-icon name="check_circle" size="20px" class="text-emerald-600 shrink-0 mt-0.5" />
              <span class="text-xs md:text-sm text-gray-700 font-medium leading-snug">
                {{ item }}
              </span>
            </div>
          </div>
        </div>

        <!-- Card: Critérios de Elegibilidade -->
        <div class="rounded-3xl border border-gray-200 bg-white p-6 md:p-8 shadow-xs">
          <div class="flex items-center gap-3.5 mb-5 border-b border-gray-100 pb-4">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
              <q-icon name="verified_user" size="24px" />
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="section-title text-base md:text-lg font-semibold text-gray-900">
                Critérios de Elegibilidade
              </h2>
              <p class="section-subtitle text-xs text-gray-500">
                Quem tem direito a solicitar e utilizar este benefício
              </p>
            </div>
          </div>

          <ul class="space-y-3 !p-0 !m-0 list-none">
            <li
              v-for="(crit, idx) in eligibilityList"
              :key="idx"
              class="flex items-start gap-3 text-xs md:text-sm text-gray-700 leading-relaxed"
            >
              <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold mt-0.5">
                {{ idx + 1 }}
              </span>
              <span>{{ crit }}</span>
            </li>
          </ul>
        </div>

        <!-- Card: Locais Participantes & Endereços -->
        <div class="rounded-3xl border border-gray-200 bg-white p-6 md:p-8 shadow-xs">
          <div class="flex items-center gap-3.5 mb-5 border-b border-gray-100 pb-4">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
              <q-icon name="location_on" size="24px" />
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="section-title text-base md:text-lg font-semibold text-gray-900">
                Locais Participantes & Postos de Atendimento
              </h2>
              <p class="section-subtitle text-xs text-gray-500">
                Endereços credenciados, contatos e horários
              </p>
            </div>
          </div>

          <div class="space-y-4">
            <div
              v-for="(loc, idx) in locationsList"
              :key="idx"
              class="rounded-2xl border border-gray-200 bg-slate-50/50 p-4 transition-all hover:bg-slate-50"
            >
              <h3 class="text-sm md:text-base font-semibold text-gray-900 flex items-center gap-2 !m-0 !p-0">
                <q-icon name="apartment" size="18px" class="text-primary" />
                {{ loc.name }}
              </h3>

              <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                <div class="flex items-center gap-2">
                  <q-icon name="place" size="16px" class="text-gray-400 shrink-0" />
                  <span>{{ loc.address }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <q-icon name="phone" size="16px" class="text-gray-400 shrink-0" />
                  <span>{{ loc.phone }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <q-icon name="email" size="16px" class="text-gray-400 shrink-0" />
                  <span>{{ loc.email }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <q-icon name="schedule" size="16px" class="text-gray-400 shrink-0" />
                  <span>{{ loc.hours }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Coluna Lateral (1/3): Downloads, Suporte e Contatos Rápidos -->
      <div class="space-y-8 lg:col-span-1">

        <!-- Card: Downloads de Formulários -->
        <div class="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
          <div class="flex items-center gap-2.5 mb-5 border-b border-gray-100 pb-3">
            <q-icon name="cloud_download" size="22px" class="text-primary" />
            <h2 class="section-title text-base font-semibold text-gray-900">
              Formulários & Downloads
            </h2>
          </div>

          <div class="space-y-3">
            <div
              v-for="(doc, idx) in downloadsList"
              :key="idx"
              class="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-slate-50 p-3.5 transition-all hover:bg-blue-50/60 hover:border-blue-200 cursor-pointer"
              @click="downloadDoc(doc)"
            >
              <!-- Ícone PDF + Textos juntos -->
              <div class="flex items-center gap-3 min-w-0 flex-1">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 font-bold text-xs">
                  {{ doc.type || 'PDF' }}
                </div>
                <div class="min-w-0 flex-1">
                  <h3 class="text-xs font-bold text-gray-800 leading-snug break-words !m-0 !p-0">
                    {{ doc.name }}
                  </h3>
                  <span class="text-[11px] text-gray-500 font-normal mt-0.5 block !m-0 !p-0">
                    {{ doc.size }}
                  </span>
                </div>
              </div>

              <!-- Botão Baixar circular -->
              <button
                type="button"
                aria-label="Baixar arquivo"
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-transform hover:scale-105 active:scale-95 border-none cursor-pointer"
                @click.stop="downloadDoc(doc)"
              >
                <q-icon name="download" size="16px" />
              </button>
            </div>
          </div>
        </div>

        <!-- Card: Suporte e Atendimento ao Servidor -->
        <div class="rounded-3xl bg-primary p-6 text-white shadow-md">
          <div class="flex items-center gap-2.5 mb-3">
            <q-icon name="support_agent" size="26px" />
            <h2 class="text-base font-semibold !m-0 !p-0">Dúvidas sobre o benefício?</h2>
          </div>

          <p class="text-xs text-white/85 leading-relaxed !mb-0 mt-2">
            Nossa equipe de recursos humanos e gestão de benefícios está disponível para atendê-lo de segunda a sexta, das 08h às 17h.
          </p>

          <div class="mt-4 space-y-2 text-xs text-white/90">
            <div class="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl">
              <q-icon name="phone" size="16px" />
              <span class="font-semibold">(77) 3424-8500 / 3424-8515</span>
            </div>
            <div class="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl">
              <q-icon name="email" size="16px" />
              <span class="font-semibold">beneficios@pmvc.ba.gov.br</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const props = defineProps({
  benefit: {
    type: Object,
    required: true
  }
})

defineEmits(['back'])

const proceduresList = computed(() => {
  if (props.benefit?.procedures && props.benefit.procedures.length > 0) {
    return props.benefit.procedures
  }
  return [
    'Consultas médicas e especialidades credenciadas',
    'Exames laboratoriais e diagnóstico por imagem de alta complexidade',
    'Atendimento ambulatorial e emergência 24 horas',
    'Procedimentos cirúrgicos eletivos e de urgência',
    'Acompanhamento multiprofissional (Psicologia, Fisioterapia, Nutrição)',
    'Acesso a medicamentos com desconto em farmácias conveniadas'
  ]
})

const eligibilityList = computed(() => {
  if (props.benefit?.eligibility && props.benefit.eligibility.length > 0) {
    return props.benefit.eligibility
  }
  return [
    'Servidores públicos municipais em efetivo exercício de cargo público (efetivos e comissionados)',
    'Servidores aposentados e pensionistas vinculados ao regime de previdência municipal',
    'Dependentes diretos: Cônjuge/companheiro(a) e filhos até 21 anos (ou até 24 se universitários)',
    'Menores sob guarda ou tutela judicial devidamente comprovada'
  ]
})

const locationsList = computed(() => {
  if (props.benefit?.locations && props.benefit.locations.length > 0) {
    return props.benefit.locations
  }
  return [
    {
      name: 'Central de Atendimento ao Servidor (RH Central)',
      address: 'Praça Joaquim Correia, 21 - Centro, Vitória da Conquista - BA',
      phone: '(77) 3424-8500',
      email: 'beneficios@pmvc.ba.gov.br',
      hours: 'Segunda a Sexta, 08:00 às 17:00'
    },
    {
      name: 'Clínica e Rede de Atendimento Municipal',
      address: 'Av. Brumado, 1050 - Bairro Brasil, Vitória da Conquista - BA',
      phone: '(77) 3424-8900',
      email: 'saude.servidor@pmvc.ba.gov.br',
      hours: 'Segunda a Sexta, 07:30 às 18:00'
    }
  ]
})

const downloadsList = computed(() => {
  if (props.benefit?.downloads && props.benefit.downloads.length > 0) {
    return props.benefit.downloads
  }
  return [
    { name: `Regulamento Oficial — ${props.benefit?.title || 'Benefício'}`, size: '1.4 MB', type: 'PDF' },
    { name: 'Formulário de Solicitação e Termo de Adesão', size: '420 KB', type: 'PDF' },
    { name: 'Guia de Utilização e Perguntas Frequentes', size: '860 KB', type: 'PDF' }
  ]
})

function downloadDoc(doc) {
  $q.notify({
    type: 'positive',
    message: `Iniciando download de "${doc.name}"...`,
    position: 'top-right',
    timeout: 2500
  })
}

function handleAction(action) {
  if (action === 'adesao') {
    $q.notify({
      type: 'info',
      message: 'Solicitação de adesão enviada para análise da equipe de RH.',
      position: 'top-right',
      timeout: 3000
    })
  } else if (action === 'contato') {
    $q.notify({
      type: 'positive',
      message: 'Canal de atendimento aberto! Telefone: (77) 3424-8500.',
      position: 'top-right',
      timeout: 3000
    })
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.25s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-title {
  margin: 0 !important;
  padding: 0 !important;
  line-height: 1.25 !important;
}

.section-subtitle {
  margin: 2px 0 0 0 !important;
  padding: 0 !important;
  line-height: 1.2 !important;
}
</style>
