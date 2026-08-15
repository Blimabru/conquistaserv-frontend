<template>
  <q-layout view="hHh Lpr lff">
    <q-header>
      <q-toolbar class="row justify-between items-center bg-primary px-8">
        <div>
          <q-btn
            flat
            icon="menu"
            label="Menu"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />
        </div>

        <div>
          <q-toolbar-title style="line-height: normal">
            <LogoServConquista />
          </q-toolbar-title>
        </div>

        <div class="py-4 gap-4 row flex justify-end">
            <q-input
              rounded
              dense
              standout
              bg-color="primary-light"
              class=""
              v-model="text"
              label="Buscar" >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
          

            <q-avatar
              font-size="40px"
              icon="account_circle"
            >
              <q-menu fit anchor="bottom left" self="top left" :offset="[2, 2]">
                <q-item
                  clickable
                  tag="a"
                  @click="profile"
                  exact
                  class="row items-center"
                >
                  <q-item-section>Perfil</q-item-section>
                  <q-icon name="account_circle" size="sm" />
                </q-item>
                <q-item
                  clickable
                  tag="a"
                  @click="logout"
                  exact
                  class="row items-center"
                >
                  <q-item-section>Sair</q-item-section>
                  <q-icon name="logout" size="sm" />
                </q-item>
              </q-menu>
            </q-avatar>
          
        </div>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="220"
      class="q-py-md q-px-md bg-primary-dark w"
    >
      <q-list>
        <EssentialLink v-for="link in links" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import EssentialLink from 'components/common/EssentialLink.vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../stores/authStore';

import LogoServConquista from 'components/common/LogoServConquista.vue';

onMounted(() => {
  configurarMenu();
});

const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();
const leftDrawerOpen = ref(false);
const access = ref('');
const userName = ref('');
const links = ref([]);

function getFirstName(name) {
  const firstName = name.split(' ')[0];
  return (userName.value = firstName);
}

function configurarMenu() {
  const accessLevel = window.sessionStorage.getItem('access_level');
  const userName = window.sessionStorage.getItem('name_user');
  getFirstName(userName ? userName : 'Maria Silva');
  if (accessLevel === 'ADMIN') {
    // ITENS DE NAVEGAÇÃO ADMIN

    links.value.push(
      {
        title: 'Home',
        icon: 'home',
        link: `/admin/`,
      },
      {
        title: 'Perfil',
        icon: 'account_circle',
        link: `/perfil`,
      },
      {
        title: 'Usuários',
        icon: 'group',
        link: '/usuarios',
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
      {
        title: 'Feedback',
        icon: 'chat_bubble_outline',
        link: '/feedback',
      },
    );

    access.value = 'admin';
  } else {
    // ITENS DE NAVEGAÇÃO USUARIO

    links.value.push(
      {
        title: 'Início',
        icon: 'home',
        link: `/usuario/`,
      },
      {
        title: 'Perfil',
        icon: 'account_circle',
        link: `/perfil`,
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
