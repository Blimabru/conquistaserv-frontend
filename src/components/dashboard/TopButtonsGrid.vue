<template>
  <section class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
    <!-- Card Atendimento Psicológico -->
    <q-btn
      flat
      no-caps
      class="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all flex items-center justify-between text-left h-20"
    >
      <div class="font-bold text-blue-900 leading-tight text-sm">
        Atendimento<br />Psicológico
      </div>
      <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
        <q-icon name="person" size="20px" />
      </div>
    </q-btn>

    <!-- Card CIA do Desconto -->
    <q-btn
      flat
      no-caps
      class="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all flex items-center justify-between text-left h-20"
    >
      <div class="font-bold text-blue-900 leading-tight text-sm">
        CIA<br />do desconto
      </div>
      <div class="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
        %
      </div>
    </q-btn>

    <!-- Placeholders Top Cards -->
    <div
      v-for="i in 8"
      :key="'top-slot-' + i"
      class="bg-slate-200/80 rounded-2xl border border-slate-200/60 h-20"
    />
  </section>
</template>
<script setup>
</script>