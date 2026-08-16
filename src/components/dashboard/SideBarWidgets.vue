<template>
    <!-- Sidebar / Widgets (Direita) -->
    <aside class="lg:col-span-4 flex flex-col gap-6">

        <!-- Widget 1: Acesso Rápido -->
        <div class="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <div class="flex items-center gap-2 mb-4">
                <q-img class="w-6 h-6" src="/icons/trust-icon.png" />
                <span class="text-xs font-bold text-slate-700 uppercase tracking-wider">Conheça seus benefícios</span>
            </div>
            <q-separator />
            <div class="divide-y divide-slate-100 pt-4">

            <!-- Item 1: Atendimento Psicológico -->
            <!-- Adicionado: relative overflow-hidden flex items-center justify-between cursor-pointer hover:bg-slate-50 rounded-xl px-2 -mx-2 -->
            <div class="pb-3 pt-3 flex items-center justify-between relative overflow-hidden cursor-pointer hover:bg-slate-50 rounded-xl px-2 -mx-2 transition-all">
            <!-- Texto (Adicionado z-10) -->
            <div class="z-10">
                <p class="font-bold text-slate-800 text-sm">Atendimento Psicológico</p>
                <p class="text-[11px] text-slate-400">Agende um horário com o setor.</p>
            </div>
            
            <!-- ÍCONE DE FUNDO DECORATIVO (Novo) -->
            <q-icon
                name="person"
                class="menu-card-bg-icon absolute -right-6 top-1/2 -translate-y-1/2 text-primary-dark pointer-events-none"
            />
            </div>

            <!-- Item 2: CIA do Desconto -->
            <div class="py-3 flex items-center justify-between relative overflow-hidden cursor-pointer hover:bg-slate-50 rounded-xl px-2 -mx-2 transition-all">
            <div class="z-10">
                <p class="font-bold text-slate-800 text-sm">CIA do Desconto</p>
                <p class="text-[11px] text-slate-400">Descontos para os servidores.</p>
            </div>

            <!-- ÍCONE DE FUNDO DECORATIVO (Novo) -->
            <q-icon
                name="local_offer"
                class="menu-card-bg-icon absolute -right-6 top-1/2 -translate-y-1/2 text-primary-dark pointer-events-none"
            />
            </div>

            <!-- Item 3: Escola Virtual -->
            <div class="pt-3 pb-3 flex items-center justify-between relative overflow-hidden cursor-pointer hover:bg-slate-50 rounded-xl px-2 -mx-2 transition-all">
            <div class="z-10">
                <p class="font-bold text-slate-800 text-sm">Escola Virtual</p>
                <p class="text-[11px] text-slate-400">Se especialize em cursos técnicos.</p>
            </div>

            <!-- ÍCONE DE FUNDO DECORATIVO (Novo) -->
            <q-icon
                name="school"
                class="menu-card-bg-icon absolute -right-6 top-1/2 -translate-y-1/2 text-primary-dark pointer-events-none"
            />
            </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 text-center">
            <q-btn flat no-caps dense label="Ver mais" color="primary" class="text-xs font-bold" />
        </div>
        </div>

        <!-- Widget 2: Utilitários -->
        <div class="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <div class="flex items-center gap-2 mb-4">
            <q-icon name="build" size="18px" class="text-slate-600" />
            <span class="text-xs font-bold text-slate-700 uppercase tracking-wider">Utilitários</span>
        </div>

        <q-separator />

        <div class="divide-y divide-slate-100 pt-4">
            <!-- Contra Cheque -->
            <div class="pb-3 pt-3 relative overflow-hidden cursor-pointer hover:bg-slate-50 rounded-xl px-2 -mx-2 transition-all">
            <div class="z-10 relative">
                <p class="font-bold text-slate-800 text-sm">Contra Cheque</p>
                <p class="text-[11px] text-slate-400">Acesse o seu contra cheque online.</p>
            </div>
            <!-- ÍCONE DE FUNDO DECORATIVO (Novo) -->
            <q-icon
                name="receipt_long"
                class="menu-card-bg-icon absolute -right-6 top-1/2 -translate-y-1/2 text-primary-dark pointer-events-none"
            />
            </div>

            <!-- RDV -->
            <div class="py-3 relative overflow-hidden cursor-pointer hover:bg-slate-50 rounded-xl px-2 -mx-2 transition-all">
            <div class="z-10 relative">
                <p class="font-bold text-slate-800 text-sm">RDV</p>
                <p class="text-[11px] text-slate-400">Requerimento de Direitos e Vantagens. <br/> Declaração e Termos.</p>
            </div>
            <!-- ÍCONE DE FUNDO DECORATIVO (Novo) -->
            <q-icon
                name="description"
                class="menu-card-bg-icon absolute -right-6 top-1/2 -translate-y-1/2 text-primary-dark pointer-events-none"
            />
            </div>

            <!-- Portal -->
            <div class="pt-3 pb-3 relative overflow-hidden cursor-pointer hover:bg-slate-50 rounded-xl px-2 -mx-2 transition-all">
            <div class="z-10 relative">
                <p class="font-bold text-slate-800 text-sm">Portal</p>
                <p class="text-[11px] text-slate-400">Acesso interno do portal do servidor.</p>
            </div>
            <!-- ÍCONE DE FUNDO DECORATIVO (Novo) -->
            <q-icon
                name="apps"
                class="menu-card-bg-icon absolute -right-6 top-1/2 -translate-y-1/2 text-primary-dark pointer-events-none"
            />
            </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 text-center">
            <q-btn flat no-caps dense label="Ver mais" color="primary" class="text-xs font-bold" />
        </div>
        </div>

        <!-- Widget 3: Contador de Servidores -->
        <!-- Adicionado relative overflow-hidden -->
        <div class="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center justify-between relative overflow-hidden">
        <div class="text-left z-10">
            <span class="text-4xl md:text-5xl font-black text-slate-300 tracking-tight">10k</span>
            <p class="text-slate-600 font-bold text-sm tracking-wide">Servidores</p>
        </div>
        <div class="text-right text-xs font-medium text-slate-600 leading-tight z-10">
            Trabalhando<br />Contribuindo<br />Servindo
        </div>
        <!-- ÍCONE DE FUNDO DECORATIVO (Novo - usando groups para servidores) -->
        <q-icon
            name="groups"
            class="menu-card-bg-icon absolute -right-8 top-1/2 -translate-y-1/2 text-primary-dark pointer-events-none opacity-20"
        />
        </div>

    </aside>
</template>

<style scoped>
/* Mantendo a estilização CSS que você forneceu */
.menu-card-bg-icon {
    font-size: 85px; /* Tamanho grande para vazar */
}
</style>