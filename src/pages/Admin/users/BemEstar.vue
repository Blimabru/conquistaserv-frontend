<template>
  <q-page class="bg-[#F8FAFC] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-[1280px]">

      <!-- Cabeçalho (Padrão das páginas de Documentos e Benefícios) -->
      <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-[#045DA5]">
            Bem-Estar do Servidor
          </h1>
          <p class="mt-1 text-sm sm:text-base text-gray-500 font-normal">
            Núcleo de Atenção à Saúde e de Segurança no Trabalho (NAST).
          </p>
        </div>

        <!-- Botões de Ação no Topo -->
        <div class="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-2xl border-2 border-[#045DA5] bg-white px-5 py-2.5 text-sm font-bold text-[#045DA5] shadow-xs transition-all hover:bg-blue-50 hover:shadow-md active:scale-95 cursor-pointer"
            @click="openAgendamentoModal(null)"
          >
            <q-icon name="calendar_month" size="20px" />
            <span>Agendar atendimento</span>
          </button>

          <!-- Botão direto "Preciso de ajuda agora" (Sem modal) -->
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-2xl bg-[#E2007A] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#c20069] hover:shadow-lg active:scale-95 cursor-pointer border-none animate-pulse-subtle"
          >
            <q-icon name="crisis_alert" size="20px" />
            <span>Preciso de ajuda agora</span>
          </button>
        </div>
      </div>

      <!-- SEÇÃO 1: Encontre o atendimento que você precisa (Serviços do NAST) -->
      <section class="mb-12">
        <div class="mb-6">
          <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#045DA5]">
            Encontre o atendimento que você precisa
          </h2>
          <p class="mt-1 text-sm text-gray-500 font-normal">
            Selecione a área e conheça os serviços disponíveis.
          </p>
        </div>

        <!-- Grid de Cards de Serviços (Componentizados) -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 items-stretch">
          <NastServiceCard
            v-for="serv in servicosNast"
            :key="serv.title"
            :service="serv"
            @details="openDetalhes(serv)"
            @agendar="openAgendamentoModal"
          />
        </div>
      </section>

      <!-- SEÇÃO 2: Programas que cuidam de você (Programas e Iniciativas) -->
      <section class="mb-12">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#045DA5]">
              Programas que cuidam de você
            </h2>
            <p class="mt-1 text-sm text-gray-500 font-normal">
              Participe das iniciativas de bem-estar e qualidade de vida do NAST.
            </p>
          </div>

          <button
            type="button"
            class="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-[#045DA5] hover:text-[#024881] cursor-pointer border-none bg-transparent"
          >
            <span>Ver todos</span>
            <q-icon name="arrow_forward" size="16px" />
          </button>
        </div>

        <!-- Grid de Cards de Programas (Componentizados) -->
        <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <NastProgramCard
            v-for="prog in programasNast"
            :key="prog.title"
            :program="prog"
            @details="openDetalhes(prog)"
          />
        </div>
      </section>

      <!-- Banner Informativo Sobre o NAST e Contatos -->
      <section class="rounded-3xl bg-gradient-to-r from-[#045DA5] to-[#024881] p-6 md:p-10 text-white shadow-lg relative overflow-hidden">
        <div class="absolute -right-8 -bottom-8 text-white/10 pointer-events-none select-none hidden md:block">
          <q-icon name="health_and_safety" size="200px" />
        </div>

        <div class="relative z-10 max-w-3xl">
          <span class="inline-flex items-center rounded-full bg-white/20 backdrop-blur-xs px-3 py-1 text-xs font-semibold text-white tracking-wide mb-3 border border-white/20">
            Acolhimento & Segurança
          </span>

          <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
            O NAST está sempre de portas abertas para você
          </h2>

          <p class="mt-3 text-sm md:text-base text-white/90 leading-relaxed font-normal">
            O atendimento é sigiloso, acolhedor e focado na valorização integral do servidor municipal. Você pode solicitar agendamento presencial ou orientação remota para sua unidade ou secretaria.
          </p>

          <div class="mt-6 flex flex-wrap items-center gap-4 text-xs md:text-sm text-white/90">
            <div class="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl">
              <q-icon name="place" size="18px" />
              <span>Rua Coronel Gugé, 280 - Centro (Anexo NAST)</span>
            </div>
            <div class="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl">
              <q-icon name="phone" size="18px" />
              <span>(77) 3424-8550 / 3424-8500</span>
            </div>
            <div class="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl">
              <q-icon name="email" size="18px" />
              <span>nast@pmvc.ba.gov.br</span>
            </div>
          </div>
        </div>
      </section>

    </div>

    <!-- Modais Componentizados -->
    <NastAgendamentoModal
      v-model="showAgendarModal"
      :initialService="selectedServiceTitle"
      @confirm="onConfirmAgendamento"
    />

    <NastDetailsModal
      v-model="showDetalhesModal"
      :item="selectedItem"
      @agendar="openAgendamentoModal"
    />

  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import NastServiceCard from 'src/components/cards/NastServiceCard.vue'
import NastProgramCard from 'src/components/cards/NastProgramCard.vue'
import NastAgendamentoModal from 'src/components/modals/NastAgendamentoModal.vue'
import NastDetailsModal from 'src/components/modals/NastDetailsModal.vue'

const $q = useQuasar()

const showAgendarModal = ref(false)
const showDetalhesModal = ref(false)
const selectedItem = ref(null)
const selectedServiceTitle = ref('')

// 🩺 5 Pilares de Serviços do NAST
const servicosNast = [
  {
    title: 'Saúde Mental',
    icon: 'psychology',
    iconBg: '#F3E8FF',
    iconColor: '#9333EA',
    btnBg: '#FAF5FF',
    btnTextColor: '#9333EA',
    btnBorder: '#E9D5FF',
    items: [
      'Psicologia',
      'Psiquiatria',
      'Grupos terapêuticos',
      'Atenção plena',
      'Acolhimento'
    ],
    description: 'Atendimento psicológico e psiquiátrico individualizado, além de suporte emocional e rodas de escuta.',
    longDescription: 'O serviço de Saúde Mental do NAST oferece acolhimento psicológico, acompanhamento psiquiátrico, grupos de suporte terapêutico e oficinas de mindfulness, visando o cuidado integral com o equilíbrio emocional e bem-estar do servidor.'
  },
  {
    title: 'Saúde Ocupacional',
    icon: 'medical_services',
    iconBg: '#E0F2FE',
    iconColor: '#0284C7',
    btnBg: '#F0F9FF',
    btnTextColor: '#0284C7',
    btnBorder: '#BAE6FD',
    items: [
      'Medicina do Trabalho',
      'Exames ocupacionais',
      'Avaliações clínicas',
      'Consultas periódicas',
      'Encaminhamentos'
    ],
    description: 'Exames periódicos, admissionais, retorno ao trabalho e acompanhamento de saúde do trabalhador.',
    longDescription: 'A área de Medicina e Saúde Ocupacional é responsável por zelar pela aptidão física, saúde preventiva e exames ocupacionais periódicos e de retorno ao trabalho de todos os servidores da rede municipal.'
  },
  {
    title: 'Segurança do Trabalho',
    icon: 'engineering',
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    btnBg: '#FFFBEB',
    btnTextColor: '#D97706',
    btnBorder: '#FDE68A',
    items: [
      'Ergonomia',
      'EPI',
      'Prevenção de acidentes',
      'Primeiros socorros',
      'Avaliação do ambiente'
    ],
    description: 'Vistorias nos locais de trabalho, adequação ergonômica e orientações para prevenção de acidentes.',
    longDescription: 'Equipe especializada em vistorias técnicas nos postos de trabalho das secretarias, treinamentos de primeiros socorros, distribuição/fiscalização de EPIs e laudos ergonômicos para garantir ambientes seguros e saudáveis.'
  },
  {
    title: 'Saúde e Bem-Estar',
    icon: 'accessibility_new',
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
    btnBg: '#F0FDF4',
    btnTextColor: '#16A34A',
    btnBorder: '#BBF7D0',
    items: [
      'Fisioterapia',
      'Ginástica laboral',
      'Educação física',
      'Campanhas',
      'Oficinas'
    ],
    description: 'Práticas corporais, ginástica laboral nos setores e fisioterapia para alívio de tensões e dores.',
    longDescription: 'Promoção de hábitos saudáveis, sessões de fisioterapia preventiva, ginástica laboral in company e oficinas práticas voltadas para o alívio de dores posturais e aumento da disposição física.'
  },
  {
    title: 'Serviço Social',
    icon: 'volunteer_activism',
    iconBg: '#FCE7F3',
    iconColor: '#DB2777',
    btnBg: '#FDF2F8',
    btnTextColor: '#DB2777',
    btnBorder: '#FBCFE8',
    items: [
      'Orientações',
      'Acolhimento',
      'Encaminhamentos',
      'Apoio familiar'
    ],
    description: 'Orientação socioassistencial, suporte familiar e mediação de direitos funcionais e humanos.',
    longDescription: 'O Serviço Social do NAST realiza escuta qualificada, orientações sobre direitos previdenciários e assistenciais, visitas domiciliares/hospitalares quando necessário e encaminhamentos para a rede pública de suporte.'
  }
]

// 🌱 Programas e Iniciativas do NAST
const programasNast = [
  {
    title: 'FeliS',
    subtitle: 'Felicidade Interna do Servidor',
    subtitleColor: '#CA8A04',
    icon: 'sentiment_very_satisfied',
    iconBg: '#FEF9C3',
    iconColor: '#CA8A04',
    description: 'Programa de valorização e bem-estar voltado para a felicidade, relações positivas e clima saudável no ambiente de trabalho.',
    targetAudience: 'Todos os servidores',
    nextActivity: '28/08/2026 — Encontro mensal',
    longDescription: 'O programa FeliS desenvolve ações dinâmicas, dinâmicas de integração, palestras motivacionais e oficinas práticas com o objetivo de elevar o nível de satisfação, pertencimento e realização no serviço público municipal.'
  },
  {
    title: 'GiNast',
    subtitle: 'Corpo e Mente',
    subtitleColor: '#16A34A',
    icon: 'directions_run',
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
    description: 'Atividades de ginástica laboral e práticas corporais para promover saúde física, flexibilidade, relaxamento e disposição.',
    targetAudience: 'Todos os servidores',
    nextActivity: '19/08/2026 — Ginástica laboral 7h',
    longDescription: 'Com visitas regulares aos setores da prefeitura, o GiNast leva pausas ativas com alongamento, respiração consciente e correção postural conduzidas por fisioterapeutas e educadores físicos.'
  },
  {
    title: 'Servir de Exemplo',
    subtitle: 'Reconhecimento e Inspiração',
    subtitleColor: '#0284C7',
    icon: 'auto_awesome',
    iconBg: '#E0F2FE',
    iconColor: '#0284C7',
    description: 'Iniciativa de reconhecimento de servidores que se destacam pelo comprometimento, gentileza e qualidade no atendimento público.',
    targetAudience: 'Todos os servidores',
    nextActivity: '01/09/2026 — Cerimônia de premiação',
    longDescription: 'Reconhece e compartilha boas práticas, histórias inspiradoras de superação e projetos de destaque liderados por servidores públicos municipais.'
  },
  {
    title: 'Entre Nós Mulheres',
    subtitle: 'Saúde e Sororidade',
    subtitleColor: '#DB2777',
    icon: 'diversity_1',
    iconBg: '#FCE7F3',
    iconColor: '#DB2777',
    description: 'Espaço de acolhimento, debates sobre saúde da mulher, maternidade, liderança e fortalecimento para servidoras municipais.',
    targetAudience: 'Servidoras municipais',
    nextActivity: '22/08/2026 — Roda de conversa',
    longDescription: 'Encontros periódicos com palestras com ginecologistas, psicólogas e especialistas, além de rodas de conversa sobre os desafios e conquistas das mulheres no mercado de trabalho.'
  },
  {
    title: 'Atenção Plena',
    subtitle: 'Mindfulness',
    subtitleColor: '#EA580C',
    icon: 'self_improvement',
    iconBg: '#FFEDD5',
    iconColor: '#EA580C',
    description: 'Práticas de meditação guiada e mindfulness para redução do estresse, aumento de foco e equilíbrio emocional.',
    targetAudience: 'Todos os servidores',
    nextActivity: '20/08/2026 — Sessão semanal 12h',
    longDescription: 'Técnicas acessíveis de respiração e foco no presente para ajudar os servidores a gerenciar a ansiedade, prevenir o burnout e trabalhar com mais serenidade.'
  },
  {
    title: 'Campanhas de Saúde e Segurança',
    subtitle: 'Prevenção Contínua',
    subtitleColor: '#DC2626',
    icon: 'health_and_safety',
    iconBg: '#FFE4E6',
    iconColor: '#DC2626',
    description: 'Campanhas anuais temáticas (Setembro Amarelo, Outubro Rosa, Novembro Azul e SIPAT) com palestras e exames preventivos.',
    targetAudience: 'Todos os servidores',
    nextActivity: '10/09/2026 — Abertura Setembro Amarelo',
    longDescription: 'Ações de conscientização durante todo o ano, com mutirões de vacinação, triagens de saúde, testes rápidos e seminários de segurança no trabalho.'
  }
]

function openAgendamentoModal(servico) {
  selectedServiceTitle.value = servico || ''
  showAgendarModal.value = true
}

function openDetalhes(item) {
  selectedItem.value = item
  showDetalhesModal.value = true
}

function onConfirmAgendamento(formData) {
  $q.notify({
    type: 'positive',
    message: `Solicitação de agendamento em "${formData.servico}" enviada com sucesso! A equipe do NAST entrará em contato.`,
    position: 'top-right',
    timeout: 3500
  })
}
</script>

<style scoped>
.animate-pulse-subtle {
  animation: pulseSubtle 2.5s infinite;
}

@keyframes pulseSubtle {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
}
</style>
