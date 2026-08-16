<template>
    <!-- Feed de Notícias (Esquerda) -->
    <div class="lg:col-span-8 flex flex-col gap-6">
        
        <!-- Notícia com Foto -->
        <a 
            href="https://www.pmvc.ba.gov.br/prefeitura-passa-a-contar-com-novas-secretarias-leis-sancionadas-hoje-tambem-reestruturam-pastas-ja-existentes/" 
            target="_blank" 
            rel="noopener noreferrer"
            class="bg-white border border-slate-100 rounded-3xl p-4 md:p-6 shadow-sm flex flex-col sm:flex-row gap-5 items-start transition-all hover:shadow-md hover:border-slate-200 cursor-pointer block text-inherit no-underline"
            >
                <div class="w-full sm:w-5/12 h-44 rounded-2xl overflow-hidden shrink-0">
                    <img
                        src="/images/FotoSheila.jpeg"
                        alt="Governo anuncia mudanças"
                        class="w-full h-full object-cover"
                    />
                </div>
                <div class="flex flex-col justify-between flex-1">
                    <div>
                        <span class="text-xs font-semibold text-slate-500">Reajuste, carreiras e novas regras</span>
                        <h4 class="text-lg font-bold text-blue-900 mt-1 mb-2 leading-snug">
                            Governo anuncia mudanças que afetam servidores públicos federais
                        </h4>
                        <ul class="text-xs text-slate-600 space-y-1 list-disc list-inside mb-3">
                            <li>Servidores acompanham proposta de atualização salarial</li>
                            <li>Categorias cobram avanços nas negociações com o governo</li>
                        </ul>
                    </div>
                    <span class="text-[11px] text-slate-500 font-medium">Há 4 horas · Servidores Públicos</span>
                </div>
            </a>

        <!-- Notícia 2 NAST -->
        <a 
            href="https://www.pmvc.ba.gov.br/prefeitura-inaugura-novos-espacos-para-abrigar-secretaria-municipal-de-gestao-e-inovacao-e-nast/" 
            target="_blank" 
            rel="noopener noreferrer"
            class="bg-white border border-slate-100 rounded-3xl p-4 md:p-6 shadow-sm flex flex-col sm:flex-row gap-5 items-start transition-all hover:shadow-md hover:border-slate-200 cursor-pointer block text-inherit no-underline"
            >
                <div class="w-full sm:w-5/12 h-44 rounded-2xl bg-slate-200 shrink-0 overflow-hidden">
                    <img
                        src="/images/FotoNast.jpg"
                        alt="Inauguração da nova sede da Semgi e Nast"
                        class="w-full h-full object-cover"
                    />
                </div>
                <div class="flex flex-col justify-between flex-1">
                    <div>
                        <span class="text-xs font-semibold text-slate-500">Gestão Pública & Saúde do Servidor</span>
                        <h4 class="text-lg font-bold text-blue-900 mt-1 mb-2 leading-snug">
                            Prefeitura inaugura novos espaços para abrigar Secretaria Municipal de Gestão e Inovação e Nast
                        </h4>
                        <ul class="text-xs text-slate-600 space-y-1 list-disc list-inside mb-3">
                            <li>Nova sede no Centro unifica a Semgi e o Núcleo de Atenção à Saúde e de Segurança no Trabalho (Nast).</li>
                            <li>Estrutura mais ampla para cerca de 10 mil servidores municipais.</li>
                        </ul>
                    </div>
                    <span class="text-[11px] text-slate-500 font-medium">18 de novembro de 2025 · Geral</span>
                </div>
            </a>

        <!-- Notícia 3 (Placeholder Foto) -->
        <a 
            href="https://www.pmvc.ba.gov.br/prefeitura-de-vitoria-da-conquista-autoriza-concurso-para-agentes-do-simtrans-e-adere-ao-programa-vida-no-transito/" 
            target="_blank" 
            rel="noopener noreferrer"
            class="bg-white border border-slate-100 rounded-3xl p-4 md:p-6 shadow-sm flex flex-col sm:flex-row gap-5 items-start transition-all hover:shadow-md hover:border-slate-200 cursor-pointer block text-inherit no-underline"
            >
                <div class="w-full sm:w-5/12 h-44 rounded-2xl bg-slate-200 shrink-0 overflow-hidden">
                    <!-- Opcional: imagem da notícia -->
                        <img src="/images/FotoSimtrans.jpg" alt="Concurso Simtrans e Programa Vida no Trânsito" class="w-full h-full object-cover" /> 
                </div>
                <div class="flex flex-col justify-between flex-1">
                    <div>
                        <span class="text-xs font-semibold text-slate-500">Trânsito & Concursos</span>
                        <h4 class="text-lg font-bold text-blue-900 mt-1 mb-2 leading-snug">
                            Prefeitura autoriza concurso para o Simtrans e adere ao programa Vida no Trânsito
                        </h4>
                        <ul class="text-xs text-slate-600 space-y-1 list-disc list-inside mb-3">
                            <li>Autorização oficial para realização de novo concurso público para agentes de trânsito.</li>
                            <li>Adesão a programa voltado para a prevenção de acidentes e segurança viária no município.</li>
                        </ul>
                    </div>
                    <span class="text-[11px] text-slate-500 font-medium">Mobilidade Urbana</span>
                </div>
            </a>

            <a 
                href="https://www.pmvc.ba.gov.br/candidatos-aprovados-no-quem-aprende-conquista-sao-recepcionados-pela-prefeitura-municipal/" 
                target="_blank" 
                rel="noopener noreferrer"
                class="bg-white border border-slate-100 rounded-3xl p-4 md:p-6 shadow-sm flex flex-col sm:flex-row gap-5 items-start transition-all hover:shadow-md hover:border-slate-200 cursor-pointer block text-inherit no-underline"
                >
                    <div class="w-full sm:w-5/12 h-44 rounded-2xl bg-slate-200 shrink-0 overflow-hidden">
                        <!-- Opcional: imagem da notícia -->
                        <img 
                            src="/images/FotoNoticia4.jpg" 
                            alt="Candidatos aprovados no Quem Aprende Conquista" 
                            class="w-full h-full object-cover" 
                        />
                    </div>
                    <div class="flex flex-col justify-between flex-1">
                        <div>
                            <span class="text-xs font-semibold text-slate-500">Educação & Oportunidade</span>
                            <h4 class="text-lg font-bold text-blue-900 mt-1 mb-2 leading-snug">
                                Candidatos aprovados no programa Quem Aprende Conquista são recepcionados pela Prefeitura
                            </h4>
                            <ul class="text-xs text-slate-600 space-y-1 list-disc list-inside mb-3">
                                <li>Boas-vindas aos novos participantes selecionados para o programa municipal.</li>
                                <li>Iniciativa voltada à capacitação profissional, geração de renda e inserção no mercado de trabalho.</li>
                            </ul>
                        </div>
                        <span class="text-[11px] text-slate-500 font-medium">Capacitação Profissional</span>
                    </div>
                </a>

    </div>
</template>

<script>

</script>