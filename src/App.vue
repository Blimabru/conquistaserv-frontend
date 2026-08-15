<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue';
import { api } from 'boot/axios';
import { useAuthStore } from 'src/stores/authStore';

const authStore = useAuthStore();
onMounted(() => {
  authStore.initSystem();
  const token = authStore.token || window.sessionStorage.getItem('token');

  if (token) {
    api.defaults.headers.common.Authorization = 'Bearer ' + token;
  } else {
    api.defaults.headers.common.Authorization = '';
  }
});
</script>
