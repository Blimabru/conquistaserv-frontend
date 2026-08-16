<template>
  <q-card
    flat
    bordered
    class="flex h-full flex-col justify-between rounded-xl border border-gray-200/90 bg-white p-5 transition-shadow duration-200 hover:shadow-md cursor-pointer"
    @click="$emit('view', { title, description, icon, badge, category })"
  >
    <div class="flex h-full flex-col">
      <!-- Ícone + Badge -->
      <div class="flex items-start justify-between">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary"
        >
          <q-icon
            :name="icon"
            size="24px"
            color="primary"
          />
        </div>

        <q-badge
          v-if="badge"
          :label="badge"
          color="accent"
          text-color="dark"
          rounded
          class="px-2 py-1 text-xs font-medium"
        />
      </div>

      <!-- Conteúdo -->
      <div class="mt-4 flex flex-1 flex-col">
        <h3 class="text-base font-semibold text-primary">
          {{ title }}
        </h3>

        <p class="mt-2 text-sm leading-5 text-gray-600 line-clamp-3">
          {{ description }}
        </p>

        <!-- Botão Padronizado "Ver benefício" com cor e hover estáveis -->
        <div class="mt-auto pt-4">
          <q-btn
            unelevated
            color="primary"
            text-color="white"
            :label="action || 'Ver benefício'"
            no-caps
            class="rounded-lg px-4 font-medium transition-all"
            @click.stop="$emit('view', { title, description, icon, badge, category })"
          />
        </div>
      </div>
    </div>
  </q-card>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  action: {
    type: String,
    default: 'Ver benefício'
  },
  badge: {
    type: String,
    default: null
  },
  category: {
    type: String,
    default: ''
  }
})

defineEmits(['view', 'action'])
</script>