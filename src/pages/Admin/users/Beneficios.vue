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
    <div v-else class="mx-auto max-w-[1280px]" data-tour="beneficios-secao">

      <!-- Cabeçalho -->
      <div class="mb-6">
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-[#045DA5]">
          Benefícios
        </h1>
        <p class="mt-1 text-sm sm:text-base text-gray-500 font-normal">
          Confira os benefícios disponíveis para os servidores municipais.
        </p>
      </div>

      <!-- Barra de Busca e Filtros -->
      <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
        <!-- Campo de Busca Estilo Pílula -->
        <div class="relative w-full md:w-[320px]">
          <input
            v-model="search"
            type="text"
            placeholder="Buscar benefício..."
            class="w-full rounded-full border border-gray-300 bg-white py-2.5 pl-5 pr-11 text-sm text-gray-700 placeholder-gray-400 shadow-2xs outline-none transition-all focus:border-[#045DA5] focus:ring-2 focus:ring-[#045DA5]/20"
          />
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500">
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

      <!-- Spinner de Carregamento -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-16">
        <q-spinner-dots color="primary" size="40px" />
        <p class="mt-3 text-sm text-gray-500 font-medium">Carregando benefícios...</p>
      </div>

      <template v-else>
        <!-- Destaque: renderiza dinamicamente se houver benefício marcado como destaque -->
        <q-card
          v-if="highlightBenefit && !search && selectedCategory === 'Todos'"
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
                {{ highlightBenefit.title }}
              </h2>

              <p class="mt-1 text-sm text-gray-600">
                {{ highlightBenefit.description }}
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
            :key="benefit.id || benefit.title"
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
      </template>

    </div>
  </q-page>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import BenefitCard from 'src/components/cards/BenefitCard.vue'
import BenefitDetailView from 'src/components/cards/BenefitDetailView.vue'
import { listarBeneficios } from 'src/services/beneficios/beneficiosService'

const search = ref('')
const selectedCategory = ref('Todos')
const selectedBenefit = ref(null)
const benefits = ref([])
const loading = ref(true)

function formatarBytes(bytes) {
  if (!bytes) return '0 KB'
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(0)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

function formatarBeneficio(b) {
  return {
    id: b.id,
    title: b.titulo,
    description: b.descricao,
    longDescription: b.descricaoLonga || b.descricao,
    icon: b.icone || 'loyalty',
    category: b.categoria,
    badge: b.badge,
    destaque: b.destaque,
    status: b.ativo ? 'Ativo' : 'Inativo',
    procedures: b.procedimentos || [],
    eligibility: b.elegibilidade || [],
    locations: b.locais || [],
    downloads: (b.downloads || []).map((d) => ({
      id: d.id,
      name: d.nome,
      url: d.url,
      type: d.tipo,
      size: formatarBytes(d.tamanho),
    })),
  }
}

const categories = computed(() => {
  const cats = new Set(benefits.value.map((b) => b.category).filter(Boolean))
  return ['Todos', ...cats]
})

const highlightBenefit = computed(() => {
  return benefits.value.find((b) => b.destaque)
})

const filteredBenefits = computed(() => {
  const searchTerm = search.value.toLowerCase().trim()

  return benefits.value.filter((benefit) => {
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
  const target = benefits.value.find(b => b.id === benefit.id || b.title === benefit.title) || benefit
  selectedBenefit.value = target
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function carregarDados() {
  loading.value = true
  try {
    const dados = await listarBeneficios()
    benefits.value = (dados || []).map(formatarBeneficio)
  } catch (error) {
    console.error('Erro ao carregar benefícios:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  carregarDados()
})
</script>