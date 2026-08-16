<template>
  <q-layout view="hHh Lpr lff">
    <a href="#conteudo-principal" class="skip-link">Pular para o conteúdo</a>

    <q-header>
      <q-toolbar class="row justify-between items-center bg-primary px-3 sm:px-8">
        <div>
          <!-- No celular fica só o ícone: o rótulo "Menu" roubava espaço do logo -->
          <q-btn
            flat
            icon="menu"
            :label="$q.screen.gt.xs ? 'Menu' : ''"
            aria-label="Abrir menu de navegação"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />
        </div>

        <div class="absolute left-1/2 -translate-x-1/2">
          <q-toolbar-title style="line-height: normal">
            <LogoServConquista />
          </q-toolbar-title>
        </div>

        <div class="py-4 gap-4 row flex justify-end items-center">
          <!-- Em telas pequenas a busca sai do cabeçalho (onde sobrepunha o logo)
               e passa para o topo do menu lateral. -->
          <q-input
            rounded
            dense
            standout
            bg-color="primary-light"
            class="hidden lg:block"
            v-model="text"
            label="Buscar"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-btn round flat aria-label="Notificações">
            <q-icon name="notifications" size="24px" class="text-white bg-white/10 rounded-full p-2" />
            <q-menu anchor="bottom end" self="top end" :offset="[0, 10]">
              <NotificationOpen />
            </q-menu>
          </q-btn>

          <q-btn round flat aria-label="Menu do usuário">
            <q-avatar size="43px" icon="account_circle" />

            <q-menu auto-close :offset="[10, 15]" class="bg-transparent shadow-0 no-shadow"
              style="border-radius: 28px; overflow: visible;">
              <UserMenu />
            </q-menu>
          </q-btn>

        </div>

      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above :width="220" class="q-py-md q-px-md bg-primary-dark w">
      <!-- Busca no menu: só abaixo de lg, onde ela foi removida do cabeçalho -->
      <div class="lg:hidden q-mb-md">
        <q-input rounded dense standout bg-color="primary-light" v-model="text" label="Buscar">
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <nav aria-label="Menu principal">
        <!-- role="list" explícito: o q-list renderiza uma <div> sem role, e os itens
             recebem role="listitem", que exige um pai "list" (WCAG 1.3.1). -->
        <q-list role="list">
          <EssentialLink v-for="link in links" :key="link.title" v-bind="link" />
        </q-list>
      </nav>
    </q-drawer>

    <q-page-container id="conteudo-principal" tabindex="-1">
      <router-view />
    </q-page-container>

    <!-- Assistente Virtual Vitória -->
    <VitoriaChat />
    <OnboardingTour />

    <!-- FOOTER ADICIONADO -->
    <q-footer class="bg-dark text-white q-py-md">
      <div class="row justify-center items-center q-gutter-xl">
        <!-- Logo Hackathon -->
        <img src="/images/Code4City.png" alt="Logo Hackathon" class="object-contain"
          style="max-height: 60px; width: auto;" />

        <!-- Logo Hub -->
        <img src="/images/LOGO_HUB.png" alt="Logo Hub" class="object-contain" style="max-height: 60px; width: auto;" />

        <!-- Logo Prefeitura -->
        <img src="/images/LogoPMVC.jpg" alt="Logo Prefeitura" class="object-contain"
          style="max-height: 60px; width: auto;" />
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import EssentialLink from 'components/common/EssentialLink.vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../stores/authStore';
import { useOnboardingStore } from '../stores/onboardingStore';

import LogoServConquista from 'components/common/LogoServConquista.vue';
import UserMenu from 'components/common/UserMenu.vue';
import NotificationOpen from 'components/common/NotificationOpen.vue';
import VitoriaChat from 'components/vitoria/VitoriaChat.vue';
import OnboardingTour from 'components/common/OnboardingTour.vue';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const authStore = useAuthStore();
const onboardingStore = useOnboardingStore();
const leftDrawerOpen = ref(false);
const access = ref('');
const userName = ref('');
const text = ref('');
const links = ref([]);

onMounted(() => {
  configurarMenu();

  if (authStore.needsOnboarding) {
    setTimeout(() => onboardingStore.start(router), 600);
  }
});

watch(() => route.path, () => {
  configurarMenu();
});

function getFirstName(name) {
  const firstName = (name || '').split(' ')[0];
  return (userName.value = firstName);
}

function configurarMenu() {
  const accessLevel = (window.sessionStorage.getItem('access_level') || (authStore.isAdmin ? 'ADMIN' : '')).toUpperCase();
  const rawUserName = window.sessionStorage.getItem('name_user') || authStore.nameUser;
  getFirstName(rawUserName ? rawUserName : 'Maria Silva');

  links.value = [];

  if (accessLevel === 'ADMIN') {
    // ITENS DE NAVEGAÇÃO ADMIN
    links.value.push(
      {
        title: 'Home',
        icon: 'home',
        link: '/admin/dashboard',
      },
      {
        title: 'Secretarias',
        icon: 'account_balance',
        link: '/admin/secretarias',
      },
      {
        title: 'Publicações',
        icon: 'article',
        link: '/admin/comunicacao/publicacoes',
      },
      {
        title: 'Canais',
        icon: 'list_alt',
        link: '/admin/comunicacao/canais',
      },
      {
        title: 'Serviços',
        icon: 'apps',
        link: '/admin/servicos',
      },
      {
        title: 'Documentos',
        icon: 'description',
        link: '/admin/documentos',
      },
      {
        title: 'Benefícios',
        icon: 'loyalty',
        link: '/admin/beneficios',
      },
      {
        title: 'Feedback',
        icon: 'chat_bubble_outline',
        link: '/feedback',
      },
      {
        title: 'Usuários',
        icon: 'group',
        link: '/admin/usuarios',
      },
    );

    access.value = 'admin';
  } else {
    // ITENS DE NAVEGAÇÃO USUARIO
    links.value.push(
      {
        title: 'Início',
        icon: 'home',
        link: '/inicio',
      },
      {
        title: 'Comunicação',
        icon: 'campaign',
        link: '/comunicacao',
      },
      {
        title: 'Benefícios',
        icon: 'loyalty',
        link: '/beneficios',
      },
      {
        title: 'Documentos',
        icon: 'article',
        link: '/documentos',
      },
      {
        title: 'Serviços',
        icon: 'apps',
        link: '/servicos',
      },
    );

    access.value = 'Usuário';
  }
}

async function profile() {
  router.push('/perfil');
}

async function logout() {
  router.push('/login');
  authStore.logout();
}
</script>
