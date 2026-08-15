<template>
  <div class="inline-block">
    <q-btn flat dense round icon="notifications" aria-label="Notificações">
      <q-badge
        v-if="naoLidas > 0"
        color="secondary"
        floating
        rounded
        :label="naoLidas > 99 ? '99+' : naoLidas"
      />

      <q-menu anchor="bottom right" self="top right" :offset="[0, 6]">
        <div class="min-w-[280px] p-3">
          <div class="mb-2 flex flex-nowrap items-center">
            <div class="text-sm font-medium">Notificações</div>
            <div class="grow" />
            <q-btn
              flat
              dense
              no-caps
              size="sm"
              color="primary"
              label="Ver todas"
              to="/comunicacao"
              v-close-popup
            />
          </div>

          <q-separator class="mb-2" />

          <div class="mb-2 text-sm">
            <span v-if="naoLidas > 0">
              Você tem <strong>{{ naoLidas }}</strong>
              {{ naoLidas === 1 ? 'publicação não lida' : 'publicações não lidas' }}.
            </span>
            <span v-else class="text-gray-500">Tudo em dia por aqui. ✅</span>
          </div>

          
          <q-btn
            v-if="statusPermissao !== 'granted' && statusPermissao !== 'unsupported'"
            outline
            no-caps
            dense
            color="primary"
            icon="notifications_active"
            label="Ativar notificações do navegador"
            class="mb-1 w-full"
            @click="ativarNotificacoes"
          />
          <div
            v-else-if="statusPermissao === 'granted'"
            class="mb-1 text-xs text-positive"
          >
            <q-icon name="check_circle" size="16px" /> Notificações do navegador ativas
          </div>

          
          <q-btn
            flat
            no-caps
            dense
            color="secondary"
            icon="science"
            label="Simular nova publicação"
            class="w-full"
            @click="simularNova"
          />
        </div>
      </q-menu>
    </q-btn>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { resumoNaoLidas, publicacaoAleatoriaParaNotificar } from 'src/services/comunicacaoService';
import {
  permissaoAtual,
  pedirPermissao,
  notificar,
} from 'src/services/notificationService';
import showNotification from 'src/utils/quasarPlugins/notifyMessage';

const route = useRoute();
const router = useRouter();
const naoLidas = ref(0);
const statusPermissao = ref('default');

async function atualizarContador() {
  try {
    const { total } = await resumoNaoLidas();
    naoLidas.value = total;
  } catch (e) {
    naoLidas.value = 0;
  }
}

async function ativarNotificacoes() {
  const status = await pedirPermissao();
  statusPermissao.value = status;
  if (status === 'granted') {
    showNotification('positive', 'Notificações do navegador ativadas!', 'top', 2500);
  } else if (status === 'denied') {
    showNotification(
      'warning',
      'Permissão negada. Habilite nas configurações do navegador.',
      'top',
      3500,
    );
  }
}

function simularNova() {
  const pub = publicacaoAleatoriaParaNotificar();
  if (!pub) {
    showNotification('info', 'Nenhum canal com notificação ativa.', 'top', 3000);
    return;
  }
  const enviou = notificar({
    titulo: `${pub.canal.nome}: nova publicação`,
    corpo: pub.titulo,
    tag: pub.id,
    onClick: () => router.push(`/comunicacao/publicacao/${pub.id}`),
  });
  if (!enviou) {
    showNotification(
      'info',
      'Ative as notificações do navegador para ver o alerta.',
      'top',
      3000,
    );
  }
}

watch(
  () => route.fullPath,
  () => atualizarContador(),
);

onMounted(() => {
  statusPermissao.value = permissaoAtual();
  atualizarContador();
});
</script>
