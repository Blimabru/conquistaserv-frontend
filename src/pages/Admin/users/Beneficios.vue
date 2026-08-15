<template>
  <q-page class="bg-[#F8FAFC] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-[1280px]">

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

      <!-- Destaque -->
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
            class="rounded-lg px-5 self-start md:self-auto"
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
          :action="benefit.action"
          :badge="benefit.badge"
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

const search = ref('')
const selectedCategory = ref('Todos')

const categories = [
  'Todos',
  'Saúde',
  'Alimentação',
  'Transporte',
  'Convênios',
  'Previdência'
]

const benefits = [
  {
    title: 'Plano de Saúde',
    description:
      'Consulte informações sobre seu plano de saúde, cobertura e serviços disponíveis.',
    icon: 'favorite_border',
    action: 'Ver benefício',
    category: 'Saúde'
  },
  {
    title: 'Auxílio Alimentação',
    description:
      'Consulte valores, regras e informações sobre o benefício.',
    icon: 'restaurant',
    action: 'Ver benefício',
    category: 'Alimentação'
  },
  {
    title: 'Auxílio Transporte',
    description:
      'Confira as informações e regras para utilização do auxílio.',
    icon: 'directions_bus',
    action: 'Ver benefício',
    category: 'Transporte'
  },
  {
    title: 'Convênios',
    description:
      'Confira os convênios disponíveis para servidores municipais.',
    icon: 'handshake',
    action: 'Ver convênios',
    badge: 'Novo',
    category: 'Convênios'
  },
  {
    title: 'Previdência',
    description:
      'Acesse informações relacionadas à previdência do servidor.',
    icon: 'shield',
    action: 'Consultar',
    category: 'Previdência'
  },
  {
    title: 'Benefícios e Descontos',
    description:
      'Consulte descontos e condições especiais disponíveis aos servidores.',
    icon: 'percent',
    action: 'Ver opções',
    category: 'Convênios'
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
</script>