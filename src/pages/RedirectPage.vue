<template>
  <div class="flex flex-center" style="height: 100vh">
    <q-spinner-dots size="48px" color="primary" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

onMounted(async () => {
  const authStore = useAuthStore();
  const router = useRouter();
  const token = window.sessionStorage.getItem('token');
  let accessLevel = window.sessionStorage.getItem('access_level');

  if (!token) {
    console.log('Usuário não autenticado, redirecionando para login');
    router.replace('/login');
    return;
  }

  try {
    if (!accessLevel) {
      accessLevel = await authStore.getUserAccessLevel(token);
    }

    if (accessLevel === 'ADMIN') {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/inicio');
    }
  } catch (error) {
    console.error('Erro ao redirecionar usuário:', error);
    authStore.logout();
    router.replace('/login');
  }
});
</script>

<style lang="scss" scoped></style>
