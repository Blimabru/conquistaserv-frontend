<template>
  <q-page class="bg-[#F8FAFC] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-[1280px]" data-tour="documentos-secao">

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

      <!-- Spinner de Carregamento -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-16">
        <q-spinner-dots color="primary" size="40px" />
        <p class="mt-3 text-sm text-gray-500 font-medium">Carregando documentos...</p>
      </div>

      <!-- Grid Principal: Documentos (2 colunas) + Sidebar Recentes -->
      <div v-else class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_350px] items-start">

        <!-- Grid de Documentos: 2 colunas -->
        <div>
          <div
            v-if="filteredDocuments.length > 0"
            class="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <DocumentCard
              v-for="(doc, index) in filteredDocuments"
              :key="doc.id || doc.title"
              :data-tour="index === 0 ? 'documentos-card-0' : undefined"
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
import { computed, ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import DocumentCard from 'src/components/cards/DocumentCard.vue'
import RecentDocuments from 'src/components/common/RecentDocuments.vue'
import DocumentPreviewModal from 'src/components/modals/DocumentPreviewModal.vue'
import { listarDocumentos, listarDocumentosRecentes } from 'src/services/documentos/documentosService'
import { dataRelativa } from 'src/helpers/comunicacao/formatters'

const $q = useQuasar()

const search = ref('')
const selectedCategory = ref('Todos')
const showPreviewModal = ref(false)
const selectedDoc = ref(null)
const documents = ref([])
const recentDocuments = ref([])
const loading = ref(true)

function formatarDocumento(d) {
  return {
    id: d.id,
    title: d.titulo,
    version: d.versao || 'v1.0',
    description: d.descricao,
    category: d.categoria,
    tagLabel: d.categoria,
    tagColor: d.corTag || '#E2007A',
    fileId: d.fileId,
    url: d.url,
    previewUrl: d.previewUrl || (d.url && d.url.includes('/view') ? d.url.replace('/view', '/preview') : d.url),
    createdAt: d.createdAt,
  }
}

function formatarDocumentoRecente(d) {
  return {
    ...formatarDocumento(d),
    time: dataRelativa(d.createdAt),
  }
}

const categories = computed(() => {
  const cats = new Set(documents.value.map((d) => d.category).filter(Boolean))
  return ['Todos', ...cats]
})

const filteredDocuments = computed(() => {
  const searchTerm = search.value.toLowerCase().trim()

  return documents.value.filter((document) => {
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
  const docObj = typeof doc === 'object' ? doc : documents.value.find(d => d.title === doc)

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
  const docObj = typeof doc === 'object' ? doc : documents.value.find(d => d.title === doc)
  if (docObj) {
    selectedDoc.value = docObj
    showPreviewModal.value = true
  }
}

async function carregarDados() {
  loading.value = true
  try {
    const [docsData, recentesData] = await Promise.all([
      listarDocumentos(50),
      listarDocumentosRecentes(4),
    ])
    documents.value = (docsData || []).map(formatarDocumento)
    recentDocuments.value = (recentesData || []).map(formatarDocumentoRecente)
  } catch (error) {
    console.error('Erro ao carregar documentos:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  carregarDados()
})
</script>