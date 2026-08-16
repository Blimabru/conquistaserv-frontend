<template>
    <!-- Sidebar / Widgets (Direita) -->
    <aside class="lg:col-span-4 flex flex-col gap-6">
        
        <!-- Widget 1: Acesso Rápido -->
        <div class="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <div class="divide-y divide-slate-100">
            <div class="pb-3 flex items-center justify-between">
            <div>
                <p class="font-bold text-slate-800 text-sm">Atendimento Psicológico</p>
                <p class="text-[11px] text-slate-400">Agende um horário com o setor.</p>
            </div>
            <div class="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white">
                <q-icon name="person" size="18px" />
            </div>
            </div>

            <div class="py-3 flex items-center justify-between">
            <div>
                <p class="font-bold text-slate-800 text-sm">CIA do Desconto</p>
                <p class="text-[11px] text-slate-400">Descontos para os servidores.</p>
            </div>
            <div class="w-8 h-8 rounded-xl bg-blue-700 flex items-center justify-center text-white font-bold text-sm">
                %
            </div>
            </div>

            <div class="pt-3 flex items-center justify-between">
            <div>
                <p class="font-bold text-slate-800 text-sm">Escola Virtual</p>
                <p class="text-[11px] text-slate-400">Se especialize em cursos técnicos.</p>
            </div>
            <div class="w-8 h-8 rounded-xl bg-blue-700 flex items-center justify-center text-white">
                <q-icon name="school" size="18px" />
            </div>
            </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 text-center">
            <q-btn flat no-caps dense label="Ver mais" color="primary" class="text-xs font-bold" />
        </div>
        </div>

        <!-- Widget 2: Utilitários -->
        <div class="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <div class="flex items-center gap-2 mb-4">
            <q-icon name="build" size="16px" class="text-slate-600" />
            <h5 class="text-xs font-bold text-slate-700 uppercase tracking-wider">Utilitários</h5>
        </div>

        <div class="divide-y divide-slate-100">
            <div class="pb-3">
            <p class="font-bold text-slate-800 text-sm">Contra Cheque</p>
            <p class="text-[11px] text-slate-400">Acesse o seu contra cheque online.</p>
            </div>

            <div class="py-3">
            <p class="font-bold text-slate-800 text-sm">RDV</p>
            <p class="text-[11px] text-slate-400">Requerimento de Direitos e Vantagens. Declaração e Termos.</p>
            </div>

            <div class="pt-3">
            <p class="font-bold text-slate-800 text-sm">Portal</p>
            <p class="text-[11px] text-slate-400">Acesso interno do portal do servidor.</p>
            </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 text-center">
            <q-btn flat no-caps dense label="Ver mais" color="primary" class="text-xs font-bold" />
        </div>
        </div>

        <!-- Widget 3: Contador de Servidores -->
        <div class="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
        <div class="text-left">
            <span class="text-4xl md:text-5xl font-black text-slate-300 tracking-tight">10k</span>
            <p class="text-slate-600 font-bold text-sm tracking-wide">Servidores</p>
        </div>
        <div class="text-right text-xs font-medium text-slate-400 leading-tight">
            Trabalhando<br />Contribuindo<br />Servindo
        </div>
        </div>

    </aside>

</template>