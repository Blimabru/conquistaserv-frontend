<template>
  <q-page class="bg-slate-50 min-h-screen p-4 md:p-6 lg:p-8 flex flex-col items-center w-full ">
    <div class="w-full max-w-6xl flex flex-col gap-6">
      
      <!-- 1. Top Buttons Grid -->
      <TopButtonsGrid />

      <!-- 2. Hero / Destaques Grid -->
      <DestaquesGrid />
      <!-- 3. Feed de Notícias & Widgets Laterais -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Feed de Notícias (Esquerda) -->
        <FeedNoticias />
        <!-- Sidebar / Widgets (Direita) -->
        <SideBarWidgets />
        
      </section>

      <!-- Botão Flutuante (Acessibilidade / Suporte) -->
      <div class="fixed bottom-6 right-6 z-50">
        <q-btn
          round
          size="md"
          class="bg-pink-100 text-pink-600 shadow-lg border border-pink-200"
          icon="accessibility_new"
        />
      </div>

    </div>
  </q-page>
</template>

<script setup>
import TopButtonsGrid from 'components/dashboard/TopButtonsGrid.vue'
import DestaquesGrid from 'components/dashboard/DestaquesGrid.vue'
import FeedNoticias from 'components/dashboard/FeedNoticias.vue'
import SideBarWidgets from 'components/dashboard/SideBarWidgets.vue'
</script>