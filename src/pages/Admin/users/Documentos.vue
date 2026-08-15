<template>
  <q-page class="bg-[#F8FAFC] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-[1280px]">

      <!-- Cabeçalho -->
      <div class="mb-6">
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-[#045DA5]">
          Documentos
        </h1>
        <p class="mt-1 text-sm sm:text-base text-gray-500 font-normal">
          Confira todos documentos importantes da prefeitura.
        </p>
      </div>

      <!-- Barra de Busca e Filtros -->
      <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
        <!-- Campo de Busca Estilo Pílula -->
        <div class="relative w-full md:w-[320px]">
          <input
            v-model="search"
            type="text"
            placeholder="Pesquise um documento."
            class="w-full rounded-full border border-gray-300 bg-white py-2.5 pl-5 pr-11 text-sm text-gray-700 placeholder-gray-400 shadow-2xs outline-none transition-all focus:border-[#045DA5] focus:ring-2 focus:ring-[#045DA5]/20"
          />
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400">
            <q-icon name="search" size="20px" />
          </span>
        </div>

        <!-- Filtros por Categoria -->
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

      <!-- Grid Principal: Documentos (2 colunas) + Sidebar Recentes -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_350px] items-start">

        <!-- Grid de Documentos: 2 colunas -->
        <div>
          <div
            v-if="filteredDocuments.length > 0"
            class="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <DocumentCard
              v-for="doc in filteredDocuments"
              :key="doc.id || doc.title"
              :title="doc.title"
              :description="doc.description"
              :version="doc.version || 'v1.0'"
              :tag-label="doc.tagLabel || doc.category"
              :tag-color="doc.tagColor || '#E2007A'"
              @download="handleDownload(doc)"
              @view="handleView(doc)"
            />
          </div>

          <!-- Mensagem caso não encontre nenhum documento -->
          <div
            v-else
            class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center"
          >
            <q-icon name="search_off" size="48px" class="text-gray-300 mb-3" />
            <h3 class="text-base font-semibold text-gray-700">Nenhum documento encontrado</h3>
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

        <!-- Sidebar Recentes -->
        <aside class="w-full">
          <RecentDocuments
            :documents="recentDocuments"
            @download="handleDownload"
            @view="handleView"
          />
        </aside>

      </div>

    </div>

    <!-- Componente Reutilizável de Modal de Visualização -->
    <DocumentPreviewModal
      v-model="showPreviewModal"
      :document="selectedDoc"
      @download="handleDownload"
    />

  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import DocumentCard from 'src/components/cards/DocumentCard.vue'
import RecentDocuments from 'src/components/common/RecentDocuments.vue'
import DocumentPreviewModal from 'src/components/modals/DocumentPreviewModal.vue'

const $q = useQuasar()

const search = ref('')
const selectedCategory = ref('Todos')
const showPreviewModal = ref(false)
const selectedDoc = ref(null)

const categories = [
  'Todos',
  'Administrativo',
  'Gratificações',
  'Educação'
]

const documents = [
  {
    id: 1,
    title: 'ED-F-005 FOLHA DE PONTO',
    version: 'v1.0',
    description: 'Documento oficial para registro e controle de frequência mensal do servidor.',
    category: 'Administrativo',
    tagLabel: 'Administrativo',
    fileId: '1A0D6XtauRGoD670cjXAMdcmlzKsmLkks',
    url: 'https://drive.google.com/file/d/1A0D6XtauRGoD670cjXAMdcmlzKsmLkks/view?usp=drivesdk',
    previewUrl: 'https://drive.google.com/file/d/1A0D6XtauRGoD670cjXAMdcmlzKsmLkks/preview'
  },
  {
    id: 2,
    title: 'ED-F-006 ALTERAÇÃO DE CARGA HORÁRIA',
    version: 'v1.0',
    description: 'Formulário para solicitação e ajuste de carga horária e jornada de trabalho.',
    category: 'Administrativo',
    tagLabel: 'Administrativo',
    fileId: '13hldbltNfztWE0AoMZ319PVLqZp8eXin',
    url: 'https://drive.google.com/file/d/13hldbltNfztWE0AoMZ319PVLqZp8eXin/view?usp=drivesdk',
    previewUrl: 'https://drive.google.com/file/d/13hldbltNfztWE0AoMZ319PVLqZp8eXin/preview'
  },
  {
    id: 3,
    title: 'ED-F-007 REQUERIMENTO GRATIFICAÇÃO DE PSF',
    version: 'v1.0',
    description: 'Requerimento para solicitação de gratificação do Programa Saúde da Família.',
    category: 'Gratificações',
    tagLabel: 'Gratificações',
    fileId: '1w5denY0BcUM__80kuNzKY3CNv-hTEFPT',
    url: 'https://drive.google.com/file/d/1w5denY0BcUM__80kuNzKY3CNv-hTEFPT/view?usp=drivesdk',
    previewUrl: 'https://drive.google.com/file/d/1w5denY0BcUM__80kuNzKY3CNv-hTEFPT/preview'
  },
  {
    id: 4,
    title: 'ED-F-008 REQUERIMENTO GRATIFICAÇÃO NASF',
    version: 'v1.0',
    description: 'Requerimento para concessão de gratificação do Núcleo de Apoio à Saúde da Família.',
    category: 'Gratificações',
    tagLabel: 'Gratificações',
    fileId: '1pYbuGTIFwBLHY_x7s6bkVrV-OgV7l535',
    url: 'https://drive.google.com/file/d/1pYbuGTIFwBLHY_x7s6bkVrV-OgV7l535/view?usp=drivesdk',
    previewUrl: 'https://drive.google.com/file/d/1pYbuGTIFwBLHY_x7s6bkVrV-OgV7l535/preview'
  },
  {
    id: 5,
    title: 'ED-F-009 REQUERIMENTO GRATIFICAÇÃO CEMERF',
    version: 'v1.0',
    description: 'Requerimento de gratificação para atuação no Centro Municipal de Reabilitação Física.',
    category: 'Gratificações',
    tagLabel: 'Gratificações',
    fileId: '1PuqROCodIktX9xq46IQjmhqxUlPl1uot',
    url: 'https://drive.google.com/file/d/1PuqROCodIktX9xq46IQjmhqxUlPl1uot/view?usp=drivesdk',
    previewUrl: 'https://drive.google.com/file/d/1PuqROCodIktX9xq46IQjmhqxUlPl1uot/preview'
  },
  {
    id: 6,
    title: 'ED-F-010 REQUERIMENTO GRATIFICAÇÃO SERVIÇO ESPECIAL',
    version: 'v1.0',
    description: 'Requerimento para concessão de gratificação por execução de serviços especiais.',
    category: 'Gratificações',
    tagLabel: 'Gratificações',
    fileId: '1rsY3X9O1Go0QLJmHpscczifhlKAhv16T',
    url: 'https://drive.google.com/file/d/1rsY3X9O1Go0QLJmHpscczifhlKAhv16T/view?usp=drivesdk',
    previewUrl: 'https://drive.google.com/file/d/1rsY3X9O1Go0QLJmHpscczifhlKAhv16T/preview'
  },
  {
    id: 7,
    title: 'ED-F-011 REQUERIMENTO GRATIFICAÇÃO REGÊNCIA DE CLASSE',
    version: 'v1.0',
    description: 'Requerimento de gratificação de regência de classe para docentes da rede.',
    category: 'Educação',
    tagLabel: 'Educação',
    fileId: '1EjrxnTA8Lkte3-V058Zy3L4PDHpPrmyf',
    url: 'https://drive.google.com/file/d/1EjrxnTA8Lkte3-V058Zy3L4PDHpPrmyf/view?usp=drivesdk',
    previewUrl: 'https://drive.google.com/file/d/1EjrxnTA8Lkte3-V058Zy3L4PDHpPrmyf/preview'
  },
  {
    id: 8,
    title: 'ED-F-012 REQUERIMENTO GRATIFICAÇÃO REGÊNCIA DE CLASSE - ALUNO ESPECIAL',
    version: 'v1.0',
    description: 'Gratificação de regência de classe para atendimento a alunos com necessidades especiais.',
    category: 'Educação',
    tagLabel: 'Educação',
    fileId: '1xMlKTN8db5NniuTHnuIthzGf1EhyO-AC',
    url: 'https://drive.google.com/file/d/1xMlKTN8db5NniuTHnuIthzGf1EhyO-AC/view?usp=drivesdk',
    previewUrl: 'https://drive.google.com/file/d/1xMlKTN8db5NniuTHnuIthzGf1EhyO-AC/preview'
  },
  {
    id: 9,
    title: 'ED-F-013 REQUERIMENTO GRATIFICAÇÃO EXERCÍCIO EM ZONA RURAL - PROFESSOR',
    version: 'v1.0',
    description: 'Requerimento de gratificação por exercício docente em unidades escolares da zona rural.',
    category: 'Educação',
    tagLabel: 'Educação',
    fileId: '1Ja0d3VspAGYCsf-EEWb48tyip7Scn9qU',
    url: 'https://drive.google.com/file/d/1Ja0d3VspAGYCsf-EEWb48tyip7Scn9qU/view?usp=drivesdk',
    previewUrl: 'https://drive.google.com/file/d/1Ja0d3VspAGYCsf-EEWb48tyip7Scn9qU/preview'
  },
  {
    id: 10,
    title: 'ED-F-014 REQUERIMENTO GRATIFICAÇÃO REGÊNCIA DE CLASSE - EDUCAÇÃO INFANTIL',
    version: 'v1.0',
    description: 'Requerimento de gratificação de regência de classe na educação infantil municipal.',
    category: 'Educação',
    tagLabel: 'Educação',
    fileId: '1jFM_A2me8J0EW2BALXlSKO-jYwyH1hxl',
    url: 'https://drive.google.com/file/d/1jFM_A2me8J0EW2BALXlSKO-jYwyH1hxl/view?usp=drivesdk',
    previewUrl: 'https://drive.google.com/file/d/1jFM_A2me8J0EW2BALXlSKO-jYwyH1hxl/preview'
  }
]

const recentDocuments = [
  {
    title: 'ED-F-005 FOLHA DE PONTO',
    time: '10 min atrás',
    description: 'Documento oficial para registro e controle de frequência mensal do servidor.',
    tagLabel: 'Administrativo',
    category: 'Administrativo',
    fileId: '1A0D6XtauRGoD670cjXAMdcmlzKsmLkks',
    url: 'https://drive.google.com/file/d/1A0D6XtauRGoD670cjXAMdcmlzKsmLkks/view?usp=drivesdk',
    previewUrl: 'https://drive.google.com/file/d/1A0D6XtauRGoD670cjXAMdcmlzKsmLkks/preview'
  },
  {
    title: 'ED-F-006 ALTERAÇÃO DE CARGA HORÁRIA',
    time: '1 hora atrás',
    description: 'Formulário para solicitação e ajuste de carga horária e jornada de trabalho.',
    tagLabel: 'Administrativo',
    category: 'Administrativo',
    fileId: '13hldbltNfztWE0AoMZ319PVLqZp8eXin',
    url: 'https://drive.google.com/file/d/13hldbltNfztWE0AoMZ319PVLqZp8eXin/view?usp=drivesdk',
    previewUrl: 'https://drive.google.com/file/d/13hldbltNfztWE0AoMZ319PVLqZp8eXin/preview'
  },
  {
    title: 'ED-F-007 REQUERIMENTO GRATIFICAÇÃO DE PSF',
    time: 'Hoje',
    description: 'Requerimento para solicitação de gratificação do Programa Saúde da Família.',
    tagLabel: 'Gratificações',
    category: 'Gratificações',
    fileId: '1w5denY0BcUM__80kuNzKY3CNv-hTEFPT',
    url: 'https://drive.google.com/file/d/1w5denY0BcUM__80kuNzKY3CNv-hTEFPT/view?usp=drivesdk',
    previewUrl: 'https://drive.google.com/file/d/1w5denY0BcUM__80kuNzKY3CNv-hTEFPT/preview'
  },
  {
    title: 'ED-F-011 REQUERIMENTO GRATIFICAÇÃO REGÊNCIA DE CLASSE',
    time: 'Ontem',
    description: 'Requerimento de gratificação de regência de classe para docentes da rede.',
    tagLabel: 'Educação',
    category: 'Educação',
    fileId: '1EjrxnTA8Lkte3-V058Zy3L4PDHpPrmyf',
    url: 'https://drive.google.com/file/d/1EjrxnTA8Lkte3-V058Zy3L4PDHpPrmyf/view?usp=drivesdk',
    previewUrl: 'https://drive.google.com/file/d/1EjrxnTA8Lkte3-V058Zy3L4PDHpPrmyf/preview'
  }
]

const filteredDocuments = computed(() => {
  const searchTerm = search.value.toLowerCase().trim()

  return documents.filter((document) => {
    const matchesCategory =
      selectedCategory.value === 'Todos' ||
      document.category === selectedCategory.value

    const matchesSearch =
      !searchTerm ||
      document.title.toLowerCase().includes(searchTerm) ||
      document.description.toLowerCase().includes(searchTerm)

    return matchesCategory && matchesSearch
  })
})

function clearFilters() {
  search.value = ''
  selectedCategory.value = 'Todos'
}

function handleDownload(doc) {
  const title = typeof doc === 'object' ? doc.title : doc
  const docObj = typeof doc === 'object' ? doc : documents.find(d => d.title === doc)

  if (docObj?.fileId) {
    const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${docObj.fileId}`
    window.open(directDownloadUrl, '_blank')
  } else if (docObj?.url) {
    window.open(docObj.url, '_blank')
  }

  $q.notify({
    type: 'positive',
    message: `Iniciando download de "${title}"...`,
    position: 'top-right',
    timeout: 2500
  })
}

function handleView(doc) {
  const docObj = typeof doc === 'object' ? doc : documents.find(d => d.title === doc)
  if (docObj) {
    selectedDoc.value = docObj
    showPreviewModal.value = true
  }
}
</script>