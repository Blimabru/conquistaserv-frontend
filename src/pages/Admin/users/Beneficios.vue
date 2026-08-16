<template>
  <q-page class="bg-[#F8FAFC] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    
    <!-- Visualização de Detalhes do Benefício -->
    <div v-if="selectedBenefit">
      <BenefitDetailView
        :benefit="selectedBenefit"
        @back="selectedBenefit = null"
      />
    </div>

    <!-- Listagem Principal de Benefícios -->
    <div v-else class="mx-auto max-w-[1280px]">

      <!-- Cabeçalho -->
      <div class="mb-6">
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-[#045DA5]">
          Benefícios
        </h1>
        <p class="mt-1 text-sm sm:text-base text-gray-500 font-normal">
          Confira os benefícios disponíveis para os servidores municipais.
        </p>
      </div>

      <!-- Barra de Busca e Filtros (Mesmo padrão da página de Documentos) -->
      <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
        <!-- Campo de Busca Estilo Pílula -->
        <div class="relative w-full md:w-[320px]">
          <input
            v-model="search"
            type="text"
            placeholder="Buscar benefício..."
            class="w-full rounded-full border border-gray-300 bg-white py-2.5 pl-5 pr-11 text-sm text-gray-700 placeholder-gray-400 shadow-2xs outline-none transition-all focus:border-[#045DA5] focus:ring-2 focus:ring-[#045DA5]/20"
          />
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400">
            <q-icon name="search" size="20px" />
          </span>
        </div>

        <!-- Filtros por Categoria Estilo Pílula -->
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="category in categories"
            :key="category"
            type="button"
            class="rounded-full px-5 py-2 text-sm font-medium transition-all duration-150 cursor-pointer border-none"
            :class="
              selectedCategory === category
                ? 'bg-[#045DA5] text-white shadow-xs font-semibold'
                : 'bg-transparent text-[#045DA5] hover:bg-blue-50'
            "
            @click="selectedCategory = category"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- Destaque: Exatamente no modelo original -->
      <q-card
        flat
        bordered
        class="mb-8 rounded-2xl border-primary-light bg-primary-light p-5 md:p-6"
      >
        <div
          class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p
              class="text-xs font-bold uppercase tracking-wider text-primary"
            >
              Destaque
            </p>

            <h2 class="mt-2 text-lg font-semibold text-primary">
              Plano de Saúde — Período de Adesão Aberto
            </h2>

            <p class="mt-1 text-sm text-gray-600">
              O período de adesão ao plano de saúde está aberto até
              30/08/2026. Confira as coberturas e realize sua adesão.
            </p>
          </div>

          <q-btn
            unelevated
            color="secondary"
            label="Saiba mais"
            no-caps
            class="rounded-lg px-5 self-start md:self-auto cursor-pointer"
            @click="openBenefitDetails(highlightBenefit)"
          />
        </div>
      </q-card>

      <!-- Grid de Benefícios com Ícones -->
      <div
        v-if="filteredBenefits.length > 0"
        class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <BenefitCard
          v-for="benefit in filteredBenefits"
          :key="benefit.title"
          :title="benefit.title"
          :description="benefit.description"
          :icon="benefit.icon"
          :action="'Ver benefício'"
          :badge="benefit.badge"
          :category="benefit.category"
          @view="openBenefitDetails(benefit)"
        />
      </div>

      <!-- Mensagem caso não encontre nenhum benefício -->
      <div
        v-else
        class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center"
      >
        <q-icon name="search_off" size="48px" class="text-gray-300 mb-3" />
        <h3 class="text-base font-semibold text-gray-700">Nenhum benefício encontrado</h3>
        <p class="mt-1 text-sm text-gray-500">Tente ajustar o termo de pesquisa ou a categoria selecionada.</p>
        <button
          type="button"
          class="mt-4 rounded-full bg-[#045DA5] px-4 py-2 text-xs font-semibold text-white cursor-pointer border-none"
          @click="clearFilters"
        >
          Limpar filtros
        </button>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import BenefitCard from 'src/components/cards/BenefitCard.vue'
import BenefitDetailView from 'src/components/cards/BenefitDetailView.vue'

const search = ref('')
const selectedCategory = ref('Todos')
const selectedBenefit = ref(null)

const categories = [
  'Todos',
  'Saúde',
  'Alimentação',
  'Transporte',
  'Convênios',
  'Previdência'
]

const highlightBenefit = {
  title: 'Plano de Saúde',
  description:
    'Consulte informações sobre seu plano de saúde, cobertura e serviços disponíveis.',
  longDescription:
    'Plano de assistência médica e hospitalar com ampla rede credenciada em Vitória da Conquista e região, cobrindo consultas, exames, urgências, internações e cirurgias eletivas para servidores e dependentes.',
  icon: 'favorite_border',
  action: 'Ver benefício',
  category: 'Saúde',
  status: 'Ativo',
  procedures: [
    'Consultas médicas em mais de 35 especialidades credenciadas',
    'Exames laboratoriais e diagnósticos por imagem de alta complexidade (Ressonância, Tomografia, Ultrassom)',
    'Atendimento de urgência e emergência 24h na rede hospitalar conveniada',
    'Internações clínicas, cirúrgicas e terapia intensiva (UTI)',
    'Sessões de fisioterapia, fonoaudiologia, psicologia e nutrição',
    'Parto e assistência obstétrica integral'
  ],
  eligibility: [
    'Servidores públicos municipais efetivos, estáveis e comissionados ativos',
    'Aposentados e pensionistas vinculados ao regime próprio de previdência municipal',
    'Dependentes diretos: Cônjuge/companheiro(a), filhos até 21 anos (ou até 24 se universitários)',
    'Menores sob guarda ou tutela judicial devidamente comprovada'
  ],
  locations: [
    {
      name: 'Hospital Samur (Pronto-Socorro e Internação)',
      address: 'Av. Irecê, 145 - Bairro Brasil',
      phone: '(77) 2101-5000',
      email: 'atendimento@samur.com.br',
      hours: '24 horas'
    },
    {
      name: 'Clínica Mais Saúde Servidor',
      address: 'Rua Coronel Gugé, 280 - Centro',
      phone: '(77) 3424-8900',
      email: 'saude.servidor@pmvc.ba.gov.br',
      hours: 'Segunda a Sexta, 07:30 às 17:30'
    },
    {
      name: 'Laboratório Central Municipal',
      address: 'Praça Guadalajara, s/n - Recreio',
      phone: '(77) 3422-7744',
      email: 'labcentral@pmvc.ba.gov.br',
      hours: 'Segunda a Sexta, 06:30 às 16:00'
    }
  ],
  downloads: [
    { name: 'Guia do Usuário e Rede Credenciada 2026', size: '2.4 MB', type: 'PDF' },
    { name: 'Formulário de Inclusão de Dependentes', size: '480 KB', type: 'PDF' },
    { name: 'Termo de Adesão e Solicitação de Carteirinha Digital', size: '320 KB', type: 'PDF' },
    { name: 'Tabela de Coparticipação e Especialidades', size: '650 KB', type: 'PDF' }
  ]
}

const benefits = [
  {
    title: 'Plano de Saúde',
    description:
      'Consulte informações sobre seu plano de saúde, cobertura e serviços disponíveis.',
    longDescription:
      'Plano de assistência médica e hospitalar com ampla rede credenciada em Vitória da Conquista e região, cobrindo consultas, exames, urgências, internações e cirurgias eletivas para servidores e dependentes.',
    icon: 'favorite_border',
    action: 'Ver benefício',
    category: 'Saúde',
    status: 'Ativo',
    procedures: [
      'Consultas médicas em mais de 35 especialidades credenciadas',
      'Exames laboratoriais e diagnósticos por imagem de alta complexidade (Ressonância, Tomografia, Ultrassom)',
      'Atendimento de urgência e emergência 24h na rede hospitalar conveniada',
      'Internações clínicas, cirúrgicas e terapia intensiva (UTI)',
      'Sessões de fisioterapia, fonoaudiologia, psicologia e nutrição',
      'Parto e assistência obstétrica integral'
    ],
    eligibility: [
      'Servidores públicos municipais efetivos, estáveis e comissionados ativos',
      'Aposentados e pensionistas vinculados ao regime próprio de previdência municipal',
      'Dependentes diretos: Cônjuge/companheiro(a), filhos até 21 anos (ou até 24 se universitários)',
      'Menores sob guarda ou tutela judicial devidamente comprovada'
    ],
    locations: [
      {
        name: 'Hospital Samur (Pronto-Socorro e Internação)',
        address: 'Av. Irecê, 145 - Bairro Brasil',
        phone: '(77) 2101-5000',
        email: 'atendimento@samur.com.br',
        hours: '24 horas'
      },
      {
        name: 'Clínica Mais Saúde Servidor',
        address: 'Rua Coronel Gugé, 280 - Centro',
        phone: '(77) 3424-8900',
        email: 'saude.servidor@pmvc.ba.gov.br',
        hours: 'Segunda a Sexta, 07:30 às 17:30'
      },
      {
        name: 'Laboratório Central Municipal',
        address: 'Praça Guadalajara, s/n - Recreio',
        phone: '(77) 3422-7744',
        email: 'labcentral@pmvc.ba.gov.br',
        hours: 'Segunda a Sexta, 06:30 às 16:00'
      }
    ],
    downloads: [
      { name: 'Guia do Usuário e Rede Credenciada 2026', size: '2.4 MB', type: 'PDF' },
      { name: 'Formulário de Inclusão de Dependentes', size: '480 KB', type: 'PDF' },
      { name: 'Termo de Adesão e Solicitação de Carteirinha Digital', size: '320 KB', type: 'PDF' },
      { name: 'Tabela de Coparticipação e Especialidades', size: '650 KB', type: 'PDF' }
    ]
  },
  {
    title: 'Auxílio Alimentação',
    description:
      'Consulte valores, regras e informações sobre o benefício.',
    longDescription:
      'Benefício mensal de caráter indenizatório destinado a subsidiar as despesas com alimentação do servidor municipal em efetivo exercício de suas funções.',
    icon: 'restaurant',
    action: 'Ver benefício',
    category: 'Alimentação',
    status: 'Ativo',
    procedures: [
      'Crédito mensal automático depositado até o 5º dia útil de cada mês',
      'Utilização exclusiva para compra de gêneros alimentícios em supermercados, feiras, mercearias e açougues conveniados',
      'Aceito em mais de 450 estabelecimentos comerciais de Vitória da Conquista e distritos',
      'Consulta de saldo e extrato em tempo real via aplicativo do cartão do servidor'
    ],
    eligibility: [
      'Servidores públicos municipais em efetivo exercício de cargo público',
      'Jornada de trabalho igual ou superior a 20 horas semanais',
      'Não acumulação indevida com benefício similar em outros órgãos municipais'
    ],
    locations: [
      {
        name: 'Coordenação de Gestão de Pessoas (RH Central)',
        address: 'Praça Joaquim Correia, 21 - Centro',
        phone: '(77) 3424-8515',
        email: 'rh.beneficios@pmvc.ba.gov.br',
        hours: 'Segunda a Sexta, 08:00 às 17:00'
      },
      {
        name: 'Central de Atendimento ao Servidor - Cartão Alimentação',
        address: 'Av. Frei Benjamin, 1200 - Bairro Brasil',
        phone: '0800 770 5000',
        email: 'atendimento@cartaoservidor.com.br',
        hours: 'Segunda a Sábado, 08:00 às 20:00'
      }
    ],
    downloads: [
      { name: 'Regulamento Oficial do Auxílio Alimentação Municipal', size: '1.1 MB', type: 'PDF' },
      { name: 'Requerimento de 2ª Via do Cartão Alimentação', size: '280 KB', type: 'PDF' },
      { name: 'Lista de Mercados e Estabelecimentos Credenciados', size: '890 KB', type: 'PDF' }
    ]
  },
  {
    title: 'Auxílio Transporte',
    description:
      'Confira as informações e regras para utilização do auxílio.',
    longDescription:
      'Concessão de crédito de transporte para deslocamento residência-trabalho e vice-versa, garantindo mobilidade aos servidores municipais.',
    icon: 'directions_bus',
    action: 'Ver benefício',
    category: 'Transporte',
    status: 'Ativo',
    procedures: [
      'Recarga mensal eletrônica no Cartão Bem / Vale Transporte Eletrônico',
      'Cobertura de linhas urbanas e linhas rurais operadas pelas concessionárias municipais',
      'Reajuste automático conforme tabela tarifária vigente do município',
      'Possibilidade de inclusão de trajetos de integração interbairros'
    ],
    eligibility: [
      'Servidores que realizam despesas com transporte coletivo público urbano ou interdistrital',
      'Declaração atualizada de endereço residencial e local de lotação',
      'Distância mínima de 1 km entre a residência e o local de trabalho'
    ],
    locations: [
      {
        name: 'Secretaria de Mobilidade Urbana (SEMOB)',
        address: 'Rua Guanambi, 65 - Bairro Brasil',
        phone: '(77) 3424-8990',
        email: 'transporte.servidor@pmvc.ba.gov.br',
        hours: 'Segunda a Sexta, 08:00 às 17:00'
      },
      {
        name: 'Posto Central ATUV - Vale Transporte',
        address: 'Praça Marcelino Mendes, s/n - Centro',
        phone: '(77) 3422-8100',
        email: 'contato@atuv.com.br',
        hours: 'Segunda a Sexta, 07:00 às 18:00'
      }
    ],
    downloads: [
      { name: 'Formulário de Solicitação e Atualização de Trajeto', size: '390 KB', type: 'PDF' },
      { name: 'Termo de Compromisso e Declaração de Residência', size: '310 KB', type: 'PDF' },
      { name: 'Mapa de Linhas e Horários do Transporte Coletivo', size: '1.8 MB', type: 'PDF' }
    ]
  },
  {
    title: 'Convênios',
    description:
      'Confira os convênios disponíveis para servidores municipais.',
    longDescription:
      'Parcerias exclusivas com faculdades, escolas de idiomas, academias, óticas e centros culturais com descontos de 15% a 60% para servidores e dependentes.',
    icon: 'handshake',
    action: 'Ver benefício',
    badge: 'Novo',
    category: 'Convênios',
    status: 'Ativo',
    procedures: [
      'Apresentação do crachá funcional ou contracheque do mês recente',
      'Desconto aplicado diretamente na matrícula, mensalidade ou pagamento',
      'Extensivo aos dependentes de 1º grau (mediante comprovação de parentesco)',
      'Sem carência ou fidelidade além das regras da instituição conveniada'
    ],
    eligibility: [
      'Todos os servidores públicos municipais ativos, aposentados e comissionados',
      'Estagiários vinculados à Prefeitura Municipal de Vitória da Conquista',
      'Dependentes legais (cônjuges e filhos)'
    ],
    locations: [
      {
        name: 'Coordenação de Parcerias e Convênios do Servidor',
        address: 'Praça Joaquim Correia, 21 - Anexo I',
        phone: '(77) 3424-8500',
        email: 'convenios@pmvc.ba.gov.br',
        hours: 'Segunda a Sexta, 08:00 às 17:00'
      },
      {
        name: 'Rede de Faculdades e Escolas Parceiras (FAINOR, UniFTC, Santo Agostinho)',
        address: 'Diversos polos em Vitória da Conquista',
        phone: '(77) 3161-1000',
        email: 'parcerias.conquista@educacao.com.br',
        hours: 'Atendimento nos respectivos campi'
      }
    ],
    downloads: [
      { name: 'Catálogo Geral de Empresas e Instituições Conveniadas 2026', size: '3.5 MB', type: 'PDF' },
      { name: 'Declaração de Vínculo Funcional para Convênios', size: '240 KB', type: 'PDF' },
      { name: 'Guia de Vantagens e Cupons no Comércio Local', size: '1.4 MB', type: 'PDF' }
    ]
  },
  {
    title: 'Previdência',
    description:
      'Acesse informações relacionadas à previdência do servidor.',
    longDescription:
      'Gestão previdenciária e acompanhamento funcional através do Instituto de Previdência dos Servidores Públicos Municipais de Vitória da Conquista.',
    icon: 'shield',
    action: 'Ver benefício',
    category: 'Previdência',
    status: 'Ativo',
    procedures: [
      'Simulação de tempo de contribuição e regras de transição de aposentadoria',
      'Solicitação e emissão de Certidão de Tempo de Contribuição (CTC)',
      'Abertura de processos de aposentadoria voluntária, por idade ou invalidez',
      'Concessão de pensão por morte e auxílio-reclusão aos dependentes'
    ],
    eligibility: [
      'Servidores públicos municipais titulares de cargo efetivo',
      'Servidores aposentados e pensionistas vinculados ao RPPS municipal'
    ],
    locations: [
      {
        name: 'Sede do Instituto de Previdência Municipal (PREVCON)',
        address: 'Av. Jesiel Norberto, 400 - Candeias',
        phone: '(77) 3420-9100',
        email: 'atendimento@prevcon.ba.gov.br',
        hours: 'Segunda a Sexta, 08:00 às 16:30'
      }
    ],
    downloads: [
      { name: 'Guia de Orientação Previdenciária e Aposentadoria', size: '2.1 MB', type: 'PDF' },
      { name: 'Requerimento de Certidão de Tempo de Contribuição (CTC)', size: '420 KB', type: 'PDF' },
      { name: 'Formulário de Atualização Cadastral e Prova de Vida', size: '350 KB', type: 'PDF' }
    ]
  },
  {
    title: 'Benefícios e Descontos',
    description:
      'Consulte descontos e condições especiais disponíveis aos servidores.',
    longDescription:
      'Clube de vantagens municipal com ampla rede de parceiros em farmácias, clínicas odontológicas, lazer, restaurantes e combustíveis com descontos diferenciados.',
    icon: 'percent',
    action: 'Ver benefício',
    category: 'Convênios',
    status: 'Ativo',
    procedures: [
      'Descontos instantâneos no balcão apresentando contracheque ou carteira virtual',
      'Parcerias com redes de farmácias com até 45% de desconto em genéricos',
      'Descontos em academias e centros de atividades físicas credenciados',
      'Validação rápida via QR Code do portal'
    ],
    eligibility: [
      'Todos os servidores públicos municipais da administração direta e indireta',
      'Cônjuges e dependentes cadastrados'
    ],
    locations: [
      {
        name: 'Central de Benefícios do Servidor',
        address: 'Praça Joaquim Correia, 21 - Centro',
        phone: '(77) 3424-8500',
        email: 'beneficios@pmvc.ba.gov.br',
        hours: 'Segunda a Sexta, 08:00 às 17:00'
      }
    ],
    downloads: [
      { name: 'Lista Completa de Farmácias e Descontos em Medicamentos', size: '1.2 MB', type: 'PDF' },
      { name: 'Manual do Clube de Descontos do Servidor', size: '980 KB', type: 'PDF' }
    ]
  }
]

const filteredBenefits = computed(() => {
  const searchTerm = search.value.toLowerCase().trim()

  return benefits.filter((benefit) => {
    const matchesCategory =
      selectedCategory.value === 'Todos' ||
      benefit.category === selectedCategory.value

    const matchesSearch =
      !searchTerm ||
      benefit.title.toLowerCase().includes(searchTerm) ||
      benefit.description.toLowerCase().includes(searchTerm)

    return matchesCategory && matchesSearch
  })
})

function clearFilters() {
  search.value = ''
  selectedCategory.value = 'Todos'
}

function openBenefitDetails(benefit) {
  const target = benefits.find(b => b.title === benefit.title) || benefit
  selectedBenefit.value = target
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>