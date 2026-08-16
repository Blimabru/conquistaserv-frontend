<template>
    <div class="w-[310px] bg-primary-light outline outline-primary outline-1 rounded-3xl p-4 flex flex-col gap-4 shadow-xl select-none">
        <!-- Header do Usuário -->
        <div class="flex items-center justify-between no-wrap">
        <div class="flex items-center no-wrap gap-2">
            <q-avatar size="48px" class="bg-white text-grey-6 shadow-sm">
            <q-icon name="person" size="32px" />
            </q-avatar>

            <div class="flex flex-col">
            <span class="font-bold text-base text-grey-9 leading-tight">
                {{ userName }}
            </span>
            <span class="text-xs text-grey-6">
                {{ department }}
            </span>
            </div>
        </div>

        <!-- Botão de Sair -->
        <q-btn
            flat
            dense
            icon="logout"
            class="bg-negative text-white !rounded-xl w-10 h-10 hover:bg-red-5 transition-colors"
            @click="logout"
        />
        </div>

        <!-- Card Configurações -->
        <div
        class="relative overflow-hidden flex items-center p-3.5 bg-white hover:bg-grey-5 rounded-2xl cursor-pointer transition-all duration-200"
        @click="goTo('/configuracoes')"
        >
        <div class="flex flex-col z-10 max-w-[70%]">
            <span class="font-bold text-sm text-grey-9">Configurações</span>
            <span class="text-xs text-grey-7">Configure suas preferências</span>
        </div>

        <!-- Ícone decorativo de fundo -->
        <q-icon
            name="settings"
            class="menu-card-bg-icon absolute -right-4 top-1/2 -translate-y-1/2 text-primary-dark pointer-events-none"
        />
        </div>

        <!-- Card Tour do Sistema -->
        <div
        v-if="!authStore.isAdmin"
        class="relative overflow-hidden flex items-center p-3.5 bg-white hover:bg-grey-5 rounded-2xl cursor-pointer transition-all duration-200"
        @click="verTourNovamente"
        >
        <div class="flex flex-col z-10 max-w-[70%]">
            <span class="font-bold text-sm text-grey-9">Ver tour do sistema</span>
            <span class="text-xs text-grey-7">Reveja a apresentação das funções do portal</span>
        </div>

        <!-- Ícone decorativo de fundo -->
        <q-icon
            name="explore"
            class="menu-card-bg-icon absolute -right-4 top-1/2 -translate-y-1/2 text-primary-dark pointer-events-none"
        />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'stores/authStore';
import { useOnboardingStore } from 'stores/onboardingStore';

const router = useRouter();
const authStore = useAuthStore();
const onboardingStore = useOnboardingStore();

const userName = ref(window.sessionStorage.getItem('name_user') || 'Usuário');
const accessLevel = window.sessionStorage.getItem('access_level');
const secretariaNome = window.sessionStorage.getItem('secretaria_nome');
const department = ref(
    secretariaNome || (accessLevel === 'ADMIN' ? 'Administrador Global' : ''),
);

function goTo(route) {
    router.push(route);
}

function verTourNovamente() {
    onboardingStore.start(router);
}

function logout() {
    authStore.logout();
    router.push('/login');
}
</script>

<style scoped>
.menu-card-bg-icon {
    font-size: 85px;
}
</style>