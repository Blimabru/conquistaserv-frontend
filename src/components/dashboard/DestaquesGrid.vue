<template>
    <section class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <!-- Destaque Principal (Esquerda) -->
        <div class="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <!-- Botão Ação Superior Direito -->
        <a
            href="https://www.pmvc.ba.gov.br/prefeitura-promove-integracao-da-nova-equipe-de-gestao-da-sashds-e-reforca-compromisso-com-a-qualidade-dos-servicos/"
            target="_blank"
            rel="noopener noreferrer"
            class="block no-underline text-inherit cursor-pointer group"
            >
            <div class="flex justify-between items-start">
                <span class="text-xs font-semibold text-slate-400 tracking-wide uppercase">
                Assistência Social & Gestão
                </span>
                <q-btn
                round
                unelevated
                color="primary"
                icon="open_in_new"
                size="sm"
                class="shadow-sm"
                href="https://www.pmvc.ba.gov.br/prefeitura-promove-integracao-da-nova-equipe-de-gestao-da-sashds-e-reforca-compromisso-com-a-qualidade-dos-servicos/"
                target="_blank"
                />
            </div>

            <div class="my-6">
                <h2 class="text-2xl md:text-3xl font-extrabold text-blue-900 leading-tight mb-4 group-hover:text-blue-700 transition-colors">
                Prefeitura promove integração da nova equipe de gestão da SASDHS e reforça compromisso com serviços
                </h2>
                <p class="text-slate-500 text-sm md:text-base leading-relaxed">
                Encontro reuniu gestores e servidores da pasta para alinhar diretrizes de trabalho e fortalecer o atendimento socioassistencial à população.
                </p>
            </div>

            <div class="h-2 w-16 bg-blue-600 rounded-full group-hover:w-24 transition-all duration-300" />
            </a>
        </div>

        <!-- Cards com Foto (Direita) -->
        <div class="lg:col-span-5 flex flex-col gap-4">
        <!-- Card RH -->
        <a
            href="https://www.pmvc.ba.gov.br/secretaria-de-transformacao-publica-traz-modernidade-e-eficiencia-a-administracao-publica-municipal/"
            target="_blank"
            rel="noopener noreferrer"
            class="relative rounded-3xl overflow-hidden shadow-sm h-48 group cursor-pointer block text-inherit no-underline"
            >
                <img
                src="/images/FotoDimas.jpeg"
                alt="Secretaria de Transformação Pública"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 flex flex-col justify-end">
                <span class="text-xs text-slate-200 font-medium tracking-wide">Gestão & Inovação</span>
                <h3 class="text-white font-bold text-base md:text-lg leading-snug">
                    Secretaria de Transformação Pública traz modernidade e eficiência à gestão
                </h3>
                <p class="text-slate-300 text-xs mt-1">Conheça as ações de modernização da administração municipal.</p>
                </div>
            </a>

        <!-- Card TI -->
        <a
            href="https://www.pmvc.ba.gov.br/papo-com-o-rh-19-09-1/"
            target="_blank"
            rel="noopener noreferrer"
            class="relative rounded-3xl overflow-hidden shadow-sm h-48 group cursor-pointer block text-inherit no-underline"
            >
                <img
                src="/images/FotoFerias.jpeg"
                alt="Papo com o RH"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 flex flex-col justify-end">
                <span class="text-xs text-slate-200 font-medium tracking-wide">Recursos Humanos</span>
                <h3 class="text-white font-bold text-base md:text-lg leading-snug">
                    Papo com o RH: Tire suas dúvidas e fique por dentro das novidades
                </h3>
                <p class="text-slate-300 text-xs mt-1 line-clamp-1">
                    Acompanhe as principais orientações e informes para os servidores públicos.
                </p>
                </div>
            </a>
        </div>

        
    </section>

</template>

<script setup>
</script>