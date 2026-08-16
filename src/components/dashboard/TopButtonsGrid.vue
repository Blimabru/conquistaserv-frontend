<template>
  <section class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
    <!-- Card Atendimento Psicológico -->
    <q-btn
      flat
      no-caps
      class="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all flex items-center justify-between text-left h-20 w-full"
      to="/servicos"
    >
      <!-- Conteúdo de texto acima do ícone -->
      <div class="font-bold text-blue-900 leading-tight text-sm z-10 flex justify-left text-left">
        Atendimento<br />Psicológico
      </div>

      <!-- Ícone decorativo posicionado no fundo do botão -->
      <q-icon
        name="person"
        class="menu-card-bg-icon absolute -right-6 top-1/2 -translate-y-1/2 text-primary-dark pointer-events-none opacity-20"
      />
    </q-btn>

    <!-- Card CIA do Desconto -->
    <q-btn
      flat
      no-caps
      class="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all flex items-center justify-between text-left h-20 w-full"
      to="/beneficios"
    >
      <!-- Conteúdo de texto acima do ícone -->
      <div class="font-bold text-blue-900 leading-tight text-sm z-10 flex justify-left text-left">
        CIA do<br />Desconto
      </div>

      <!-- Ícone decorativo posicionado no fundo do botão -->
      <q-icon
        name="percent"
        class="menu-card-bg-icon absolute -right-6 top-1/2 -translate-y-1/2 text-primary-dark pointer-events-none opacity-20"
      />
    </q-btn>
  
    <!-- Card Contra Cheque -->
    <q-btn
      flat
      no-caps
      class="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all flex items-center justify-between text-left h-20 w-full"
      to="/servicos"
    >
      <!-- Conteúdo de texto acima do ícone -->
      <div class="font-bold text-blue-900 leading-tight text-sm z-10 flex justify-left text-left">
        Contra<br />Cheque
      </div>

      <!-- Ícone decorativo posicionado no fundo do botão -->
      <q-icon
        name="attach_money"
        class="menu-card-bg-icon absolute -right-6 top-1/2 -translate-y-1/2 text-primary-dark pointer-events-none opacity-20"
      />
    </q-btn>

    
    <!-- Card Benefícios -->
    <q-btn
      flat
      no-caps
      class="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all flex items-center justify-between text-left h-20 w-full"
      to="/beneficios"
    >
      <!-- Conteúdo de texto acima do ícone -->
      <div class="font-bold text-blue-900 leading-tight text-sm z-10 flex justify-left text-left">
        Benefícios
      </div>

      <!-- Ícone decorativo posicionado no fundo do botão -->
      <q-icon
        name="loyalty"
        class="menu-card-bg-icon absolute -right-6 top-1/2 -translate-y-1/2 text-primary-dark pointer-events-none opacity-20"
      />
    </q-btn>

    
    <!-- Serviços -->
    <q-btn
      flat
      no-caps
      class="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all flex items-center justify-between text-left h-20 w-full"
      to="/servicos"
    >
      <!-- Conteúdo de texto acima do ícone -->
      <div class="font-bold text-blue-900 leading-tight text-sm z-10 flex justify-left text-left">
        Serviços
      </div>

      <!-- Ícone decorativo posicionado no fundo do botão -->
      <q-icon
        name="apps"
        class="menu-card-bg-icon absolute -right-6 top-1/2 -translate-y-1/2 text-primary-dark pointer-events-none opacity-20"
      />
    </q-btn>
    
    <!-- Conecta -->
    <q-btn
      flat
      no-caps
      class="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all flex items-center justify-between text-left h-20 w-full"
      href="https://conectaconquista.pmvc.ba.gov.br/"
      target="_blank"
    >
      <!-- Conteúdo de texto acima do ícone -->
      <div class="font-bold text-blue-900 leading-tight text-sm z-10 flex justify-left text-left">
        Conecta<br/>Conquista
      </div>

      <!-- Ícone decorativo posicionado no fundo do botão -->
      <q-img
        src="/images/LogoConecta.png"
        class="menu-card-bg-icon absolute -right-6 top-1/2 -translate-y-1/2 text-primary-dark pointer-events-none opacity-20"
      />
    </q-btn>
  </section>
</template>
<script setup>
</script>

<style scoped>
.menu-card-bg-icon {
    font-size: 85px;
}
</style>