<template>
    <section class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <!-- Destaque Principal (Esquerda) -->
        <div class="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <!-- Botão Ação Superior Direito -->
        <div class="flex justify-between items-start">
            <span class="text-xs font-semibold text-slate-400 tracking-wide uppercase">
            Comunicação Institucional
            </span>
            <q-btn
            round
            unelevated
            color="primary"
            icon="open_in_new"
            size="sm"
            class="shadow-sm"
            />
        </div>

        <div class="my-6">
            <h2 class="text-2xl md:text-3xl font-extrabold text-blue-900 leading-tight mb-4">
            Prefeitura inicia programa de modernização administrativa com foco na redução do uso de papel
            </h2>
            <p class="text-slate-500 text-sm md:text-base leading-relaxed">
            A iniciativa prevê a implantação gradual de novas ferramentas para otimizar o fluxo de trabalho entre as secretarias.
            </p>
        </div>

        <div class="h-2 w-16 bg-blue-600 rounded-full" />
        </div>

        <!-- Cards com Foto (Direita) -->
        <div class="lg:col-span-5 flex flex-col gap-4">
        <!-- Card RH -->
        <div class="relative rounded-3xl overflow-hidden shadow-sm h-48 group cursor-pointer">
            <img
            src="https://picsum.photos/600/400?random=1"
            alt="RH divulga calendário de férias"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 flex flex-col justify-end">
            <span class="text-xs text-slate-200 font-medium tracking-wide">Recursos Humanos</span>
            <h3 class="text-white font-bold text-base md:text-lg leading-snug">
                RH divulga calendário de férias
            </h3>
            <p class="text-slate-300 text-xs mt-1">Consulte os prazos para solicitação.</p>
            </div>
        </div>

        <!-- Card TI -->
        <div class="relative rounded-3xl overflow-hidden shadow-sm h-48 group cursor-pointer">
            <img
            src="https://picsum.photos/600/400?random=2"
            alt="Secretaria de TI amplia rede de internet"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 flex flex-col justify-end">
            <span class="text-xs text-slate-200 font-medium tracking-wide">Tecnologia</span>
            <h3 class="text-white font-bold text-base md:text-lg leading-snug">
                Secretaria de TI amplia rede de internet nos prédios públicos
            </h3>
            <p class="text-slate-300 text-xs mt-1 line-clamp-1">
                A modernização melhora a estabilidade dos sistemas utilizados pelos servidores.
            </p>
            </div>
        </div>
        </div>
    </section>

</template>

<script setup>
</script>