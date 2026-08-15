<template>
  <q-page class="bg-[#F8FAFC] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-[1280px]">

      <!-- Cabeçalho -->
      <div class="mb-6">
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-[#045DA5]">
          Serviços
        </h1>
        <p class="mt-1 text-sm sm:text-base text-gray-500 font-normal">
          Encontre rapidamente os serviços disponíveis para você.
        </p>
      </div>

      <!-- Barra de Busca e Filtros (Alinhados no mesmo padrão de Benefícios e Documentos) -->
      <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
        <!-- Campo de Busca Estilo Pílula -->
        <div class="relative w-full md:w-[320px]">
          <input
            v-model="search"
            type="text"
            placeholder="Buscar serviço..."
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

      <!-- Seção: Serviços mais acessados -->
      <section v-if="!search && selectedCategory === 'Todos'" class="mb-9">
        <h2 class="text-base font-bold text-[#045DA5] mb-4">
          Serviços mais acessados
        </h2>

        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          <div
            v-for="quick in quickServices"
            :key="quick.title"
            class="group flex items-center gap-3 rounded-2xl border border-gray-200/90 bg-white p-3.5 px-4 shadow-2xs transition-all duration-200 hover:border-[#045DA5]/40 hover:shadow-md cursor-pointer"
            @click="handleAction(quick.title)"
          >
            <div
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E5EEF6] text-[#045DA5] transition-colors group-hover:bg-[#045DA5] group-hover:text-white"
            >
              <q-icon :name="quick.icon" size="18px" />
            </div>

            <span class="text-xs md:text-sm font-semibold text-gray-800 line-clamp-1">
              {{ quick.title }}
            </span>
          </div>
        </div>
      </section>

      <!-- Seção: Todos os serviços -->
      <section>
        <h2 class="text-base font-bold text-[#045DA5] mb-4">
          Todos os serviços
        </h2>

        <!-- Grid de Cards de Serviços -->
        <div
          v-if="filteredServices.length > 0"
          class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4"
        >
          <div
            v-for="service in filteredServices"
            :key="service.id || service.title"
            class="flex h-full flex-col justify-between rounded-2xl border border-gray-200/90 bg-white p-5 shadow-2xs transition-all duration-200 hover:shadow-md hover:border-gray-300"
          >
            <!-- Topo do Card: Ícone + Título + Descrição -->
            <div class="flex items-start gap-4">
              <!-- Caixa de Ícone -->
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E5EEF6] text-[#045DA5]"
              >
                <q-icon :name="service.icon" size="24px" />
              </div>

              <!-- Título e Descrição -->
              <div class="flex-1 min-w-0">
                <h3 class="text-sm md:text-base font-bold text-[#045DA5] leading-snug">
                  {{ service.title }}
                </h3>
                <p class="mt-1.5 text-xs leading-relaxed text-gray-500 line-clamp-2">
                  {{ service.description }}
                </p>
              </div>
            </div>

            <!-- Rodapé do Card: Botão de Ação -->
            <div class="mt-5 pt-1">
              <button
                type="button"
                class="rounded-xl bg-[#045DA5] px-5 py-2 text-xs font-semibold text-white shadow-2xs transition-all duration-150 hover:bg-[#024881] hover:shadow-xs active:scale-95 cursor-pointer border-none"
                @click="handleAction(service.title)"
              >
                {{ service.action }}
              </button>
            </div>
          </div>
        </div>

        <!-- Mensagem caso não encontre nenhum serviço -->
        <div
          v-else
          class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center"
        >
          <q-icon name="search_off" size="48px" class="text-gray-300 mb-3" />
          <h3 class="text-base font-semibold text-gray-700">Nenhum serviço encontrado</h3>
          <p class="mt-1 text-sm text-gray-500">Tente ajustar o termo de pesquisa ou a categoria selecionada.</p>
          <button
            type="button"
            class="mt-4 rounded-full bg-[#045DA5] px-4 py-2 text-xs font-semibold text-white cursor-pointer border-none"
            @click="clearFilters"
          >
            Limpar filtros
          </button>
        </div>
      </section>

    </div>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const search = ref('')
const selectedCategory = ref('Todos')

const categories = [
  'Todos',
  'Financeiro',
  'Saúde',
  'Capacitação',
  'Geral'
]

const quickServices = [
  {
    title: 'Contra Cheque',
    icon: 'payments'
  },
  {
    title: 'Atendimento Psicológico',
    icon: 'psychology'
  },
  {
    title: 'Escola Virtual',
    icon: 'school'
  },
  {
    title: 'ServiHub',
    icon: 'hub'
  }
]

const services = [
  {
    id: 1,
    title: 'Contra Cheque',
    description: 'Consulte e emita seus contracheques mensais da prefeitura.',
    icon: 'payments',
    action: 'Consultar',
    category: 'Financeiro'
  },
  {
    id: 2,
    title: 'Atendimento Psicológico',
    description: 'Agende e acesse acolhimento e suporte psicológico especializado.',
    icon: 'psychology',
    action: 'Agendar',
    category: 'Saúde'
  },
  {
    id: 3,
    title: 'Escola Virtual',
    description: 'Acesse a plataforma EV.G de cursos e capacitações para servidores.',
    icon: 'school',
    action: 'Acessar cursos',
    category: 'Capacitação'
  },
  {
    id: 4,
    title: 'ServiHub',
    description: 'Central unificada de serviços, requerimentos e chamados municipais.',
    icon: 'hub',
    action: 'Abrir portal',
    category: 'Geral'
  }
]

const filteredServices = computed(() => {
  const searchTerm = search.value.toLowerCase().trim()

  return services.filter((service) => {
    const matchesCategory =
      selectedCategory.value === 'Todos' ||
      service.category === selectedCategory.value

    const matchesSearch =
      !searchTerm ||
      service.title.toLowerCase().includes(searchTerm) ||
      service.description.toLowerCase().includes(searchTerm)

    return matchesCategory && matchesSearch
  })
})

function clearFilters() {
  search.value = ''
  selectedCategory.value = 'Todos'
}

function handleAction(title) {
  $q.notify({
    type: 'positive',
    message: `Acessando "${title}"...`,
    position: 'top-right',
    timeout: 2500
  })
}
</script>