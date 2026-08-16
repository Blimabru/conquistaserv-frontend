<template>
  <q-page class="flex flex-center p-0 sm:p-4 md:p-8">
    <!-- Card Principal -->
    <div
      class="w-full max-w-6xl min-h-screen sm:min-h-[640px] bg-white rounded-none sm:rounded-[40px] md:rounded-[56px] shadow-none sm:shadow-2xl overflow-hidden flex flex-col md:flex-row relative"
    >
      <!-- LADO ESQUERDO: Imagem de fundo / Marca d'água e Tipografia -->
      <div
        class="w-full md:w-1/2 relative min-h-[30vh] sm:min-h-[280px] md:min-h-full flex items-center justify-start p-8 md:p-14 overflow-hidden bg-slate-50"
      >
        <img
          src="../assets/images/imagem-de-fundo.svg"
          alt=""
          class="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none select-none"
        />

        <div class="relative z-10 select-none">
          <h1 class="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
            <span class="text-[#f43f5e] block">Serv</span>
            <span class="text-[#075985] block">Conquista</span>
          </h1>
        </div>
      </div>

      <!-- LADO DIREITO: Painel de Autenticação -->
      <div
        class="w-full md:w-1/2 flex-1 flex items-center justify-center p-6 sm:p-10 md:p-12 bg-gradient-to-b from-slate-50/50 to-white md:bg-none"
      >
        <!-- Card Interno do Formulário -->
        <div
          class="w-full max-w-md bg-white rounded-[32px] md:rounded-[40px] p-6 sm:p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.12)] border border-slate-100 flex flex-col"
        >
          <!-- Cabeçalho -->
          <div class="text-center mb-8">
            <h2 class="text-2xl sm:text-3xl font-semibold text-slate-700">
              Faça seu acesso
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 mt-1">
              Use o seu usuário para acessar o sistema;
            </p>
          </div>

          <!-- Formulário -->
          <q-form ref="form" @submit.prevent.stop="login" class="space-y-6">
            <!-- Campo: Usuário -->
            <div class="flex flex-col">
              <q-input
                v-model="data.login"
                name="usuario"
                type="text"
                label="Usuário"
                stack-label
                autocomplete="username"
                aria-required="true"
                placeholder="seu-usuario"
                borderless
                dense
                lazy-rules
                class="login-input bg-transparent border-b border-slate-300 transition-colors focus-within:border-slate-800"
                :rules="usernameRules"
                hide-bottom-space
              >
                <template #prepend>
                  <q-icon name="mail" color="pink-6" size="20px" class="q-mr-xs" />
                </template>
              </q-input>
            </div>

            <!-- Campo: Senha -->
            <div class="flex flex-col">
              <q-input
                v-model="data.senha"
                name="password"
                :type="isPwdVisible ? 'text' : 'password'"
                label="Senha"
                stack-label
                autocomplete="current-password"
                aria-required="true"
                placeholder="••••••"
                borderless
                dense
                class="login-input bg-transparent border-b border-slate-300 transition-colors focus-within:border-slate-800"
                :rules="passwordRules"
                hide-bottom-space
              >
                <template #prepend>
                  <q-icon name="lock" color="pink-6" size="20px" class="q-mr-xs" />
                </template>
                <template #append>
                  <q-btn
                    flat
                    dense
                    round
                    size="sm"
                    :icon="isPwdVisible ? 'visibility_off' : 'visibility'"
                    :aria-label="isPwdVisible ? 'Ocultar senha' : 'Mostrar senha'"
                    :aria-pressed="isPwdVisible"
                    class="text-slate-500 hover:text-slate-700"
                    @click="isPwdVisible = !isPwdVisible"
                  />
                </template>
              </q-input>
            </div>

            <!-- Botão de Ação -->
            <div class="pt-4 flex justify-center">
              <q-btn
                type="submit"
                label="Entrar"
                no-caps
                unelevated
                class="w-44 py-2.5 rounded-full bg-[#075985] hover:bg-[#0369a1] text-white font-medium text-base transition-all shadow-md active:scale-95"
              />
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter, useRoute } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const isPwdVisible = ref(false);

onMounted(() => {
  const token = window.sessionStorage.getItem('token');
  if (token) {
    const accessLevel = (window.sessionStorage.getItem('access_level') || (authStore.isAdmin ? 'ADMIN' : 'USUARIO')).toUpperCase();
    if (accessLevel === 'ADMIN') {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/inicio');
    }
  }
});

const data = ref({
  login: '',
  senha: '',
});

const usernameRules = [
  (val) => (val && val.trim().length > 0) || 'Digite o seu nome de usuário ou e-mail',
];

const passwordRules = [
  (val) => (val && val.length > 0) || 'Digite a sua senha',
];

async function login() {
  try {
    await authStore.doLogin(data.value);
    const accessLevel = (window.sessionStorage.getItem('access_level') || (authStore.isAdmin ? 'ADMIN' : 'USUARIO')).toUpperCase();

    if (route.query.to && route.query.to !== '/' && route.query.to !== '/login') {
      router.push(route.query.to);
    } else if (accessLevel === 'ADMIN') {
      router.push('/admin/dashboard');
    } else {
      router.push('/inicio');
    }
  } catch (error) {
    console.error('Erro no login:', error);
  }
}
</script>

<style scoped>
:deep(.login-input .q-field__control) {
  min-height: 50px;
}

:deep(.login-input input) {
  font-size: 16px; /* iOS requires 16px minimum to prevent auto-zoom */
  color: #334155;
  padding-bottom: 8px;
  padding-top: 4px;
}

:deep(.login-input input::placeholder) {
  color: #64748b; /* slate-500: 4,76:1 sobre branco (WCAG 1.4.3) */
}
</style>
