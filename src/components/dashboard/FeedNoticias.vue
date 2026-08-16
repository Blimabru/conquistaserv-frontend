<template>
    <!-- Feed de Notícias (Esquerda) -->
    <div class="lg:col-span-8 flex flex-col gap-6">
        
        <!-- Notícia com Foto -->
        <div class="bg-white border border-slate-100 rounded-3xl p-4 md:p-6 shadow-sm flex flex-col sm:flex-row gap-5 items-start">
        <div class="w-full sm:w-5/12 h-44 rounded-2xl overflow-hidden shrink-0">
            <img
            src="https://picsum.photos/600/400?random=3"
            alt="Governo anuncia mudanças"
            class="w-full h-full object-cover"
            />
        </div>
        <div class="flex flex-col justify-between flex-1">
            <div>
            <span class="text-xs font-semibold text-slate-400">Reajuste, carreiras e novas regras</span>
            <h4 class="text-lg font-bold text-blue-900 mt-1 mb-2 leading-snug">
                Governo anuncia mudanças que afetam servidores públicos federais
            </h4>
            <ul class="text-xs text-slate-600 space-y-1 list-disc list-inside mb-3">
                <li>Servidores acompanham proposta de atualização salarial</li>
                <li>Categorias cobram avanços nas negociações com o governo</li>
            </ul>
            </div>
            <span class="text-[11px] text-slate-400 font-medium">Há 4 horas · Servidores Públicos</span>
        </div>
        </div>

        <!-- Notícia 2 (Placeholder Foto) -->
        <div class="bg-white border border-slate-100 rounded-3xl p-4 md:p-6 shadow-sm flex flex-col sm:flex-row gap-5 items-start">
        <div class="w-full sm:w-5/12 h-44 rounded-2xl bg-slate-200 shrink-0" />
        <div class="flex flex-col justify-between flex-1">
            <div>
            <span class="text-xs font-semibold text-slate-400">Resumo de categoria da Notícia</span>
            <h4 class="text-lg font-bold text-blue-900 mt-1 mb-2 leading-snug">
                Lorem ipsum, não lembro mais como escreve o resto aqui, só colocando palavras
            </h4>
            <ul class="text-xs text-slate-600 space-y-1 list-disc list-inside mb-3">
                <li>Descrição geral sobre a notícia, a própria (IA) pode fazer este breve resumo.</li>
                <li>Dá pra colocar outras coisas também</li>
            </ul>
            </div>
            <span class="text-[11px] text-slate-400 font-medium">Há 5 horas · Geral</span>
        </div>
        </div>

        <!-- Notícia 3 (Placeholder Foto) -->
        <div class="bg-white border border-slate-100 rounded-3xl p-4 md:p-6 shadow-sm flex flex-col sm:flex-row gap-5 items-start">
        <div class="w-full sm:w-5/12 h-44 rounded-2xl bg-slate-200 shrink-0" />
        <div class="flex flex-col justify-between flex-1">
            <div>
            <span class="text-xs font-semibold text-slate-400">Resumo de categoria da Notícia</span>
            <h4 class="text-lg font-bold text-blue-900 mt-1 mb-2 leading-snug">
                Lorem ipsum, não lembro mais como escreve o resto aqui, só colocando palavras
            </h4>
            <ul class="text-xs text-slate-600 space-y-1 list-disc list-inside mb-3">
                <li>Descrição geral sobre a notícia, a própria (IA) pode fazer este breve resumo.</li>
                <li>Dá pra colocar outras coisas também</li>
            </ul>
            </div>
            <span class="text-[11px] text-slate-400 font-medium">Há 5 horas · Geral</span>
        </div>
        </div>

    </div>
</template>

<script>

</script>