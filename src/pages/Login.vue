<template>
  <q-page class="flex flex-center p-4 sm:p-8">
    <!-- Card Principal -->
    <div
      class="w-full max-w-6xl min-h-[640px] bg-white rounded-[40px] md:rounded-[56px] shadow-2xl overflow-hidden flex flex-col md:flex-row relative"
    >
      <!-- LADO ESQUERDO: Imagem de fundo / Marca d'água e Tipografia -->
      <div
        class="w-full md:w-1/2 relative min-h-[280px] md:min-h-full flex items-center justify-start p-8 md:p-14 overflow-hidden bg-slate-50"
      >
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
          alt="Equipe de trabalho"
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
        class="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-12 bg-gradient-to-b from-slate-50/50 to-white md:bg-none"
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
            <p class="text-xs sm:text-sm text-slate-400 mt-1">
              Use o seu usuário para acessar o sistema;
            </p>
          </div>

          <!-- Formulário -->
          <q-form ref="form" @submit.prevent.stop="login" class="space-y-6">
            <!-- Campo: Usuário -->
            <div class="flex flex-col">
              <label class="text-xs font-semibold text-slate-500 mb-1">
                Usuário
              </label>

              <q-input
                v-model="data.login"
                name="usuario"
                type="text"
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

              <div class="mt-1">
                <a
                  href="javascript:void(0)"
                  class="text-[11px] font-medium text-[#f43f5e] hover:underline"
                >
                  Esqueceu seu usuário?
                </a>
              </div>
            </div>

            <!-- Campo: Senha -->
            <div class="flex flex-col">
              <label class="text-xs font-semibold text-slate-500 mb-1">
                Senha
              </label>

              <q-input
                v-model="data.senha"
                name="password"
                :type="isPwdVisible ? 'text' : 'password'"
                placeholder="••••••"
                autocomplete="off"
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
                  <q-icon
                    :name="isPwdVisible ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer text-slate-400 hover:text-slate-600"
                    size="18px"
                    @click="isPwdVisible = !isPwdVisible"
                  />
                </template>
              </q-input>

              <div class="mt-1">
                <a
                  href="javascript:void(0)"
                  class="text-[11px] font-medium text-[#f43f5e] hover:underline"
                >
                  Esqueceu sua senha?
                </a>
              </div>
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const isPwdVisible = ref(false)

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})

const data = ref({
  login: '',
  senha: '',
})

const usernameRules = [
  (val) => (val && val.length > 0) || 'Digite o seu nome de usuário',
  (val) =>
    validateName(val) ||
    "*Proibido o uso dos seguintes caracteres [!@#$%*()_+=-?°``''~©,.;<>:], valores numéricos ou espaços",
]

const passwordRules = [
  (val) => (val && val.length > 0) || 'Digite a sua senha',
]

function validateName(name) {
  const regexText = /[^a-zA-Zs]/g
  return !regexText.test(name)
}

async function login() {
  try {
    await authStore.doLogin(data.value)
    const toPath = route.query.to || '/'
    router.push(toPath)
  } catch (error) {
    console.error('Erro no login:', error)
  }
}
</script>

<style scoped>
:deep(.login-input .q-field__control) {
  height: 38px;
  padding: 0;
}

:deep(.login-input input) {
  font-size: 0.95rem;
  color: #334155;
}

:deep(.login-input input::placeholder) {
  color: #94a3b8;
}
</style>