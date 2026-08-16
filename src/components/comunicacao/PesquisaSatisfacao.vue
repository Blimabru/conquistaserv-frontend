<template>
  <div class="relative bg-transparent pt-2 pb-1">
    
    <q-btn flat round dense icon="close" color="grey-6" size="sm"
      class="absolute top-0 right-0 text-gray-500 hover:text-gray-600" aria-label="Fechar pesquisa"
      @click="$emit('fechar')">
      <q-tooltip>Fechar pesquisa</q-tooltip>
    </q-btn>

    
    <div class="mb-3 flex items-center gap-2 pr-6">
      <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <q-icon name="sentiment_satisfied_alt" size="18px" />
      </div>
      <div>
        <h4 class="text-sm font-medium text-gray-800 leading-none">Pesquisa Rápida de Satisfação</h4>
        <span class="text-[11px] text-gray-500">Sua opinião ajuda a melhorar nossa comunicação</span>
      </div>
    </div>

    
    <div v-if="concluida" class="flex flex-col items-center py-3 text-center text-positive">
      <q-icon name="check_circle" size="38px" color="positive" />
      <div class="mt-1.5 text-sm font-medium text-gray-800">
        Obrigado pela sua resposta!
      </div>
      <div class="text-xs text-gray-500">
        Sua opinião anônima foi salva com sucesso.
      </div>
    </div>

    
    <div v-else>
      <p class="mb-3 text-xs font-medium text-gray-700">{{ pergunta }}</p>

      <div class="mb-3 grid grid-cols-5 gap-1" role="radiogroup" :aria-label="pergunta">
        <button v-for="c in carinhas" :key="c.nota" type="button"
          role="radio" :aria-checked="nota === c.nota"
          class="flex flex-col items-center justify-center rounded-xl p-1.5 transition-all duration-150"
          :class="[
            nota === c.nota
              ? 'bg-primary/10 text-primary font-medium scale-105'
              : 'bg-transparent text-gray-600 hover:bg-gray-100/60'
          ]" :aria-label="c.label" @click="nota = c.nota">
          <span class="text-2xl leading-none transition-transform duration-150"
            :class="nota === c.nota ? 'scale-110' : 'opacity-80'">{{ c.emoji }}</span>
          <span class="mt-1 text-center text-[10px] font-medium leading-tight text-gray-600">{{
            c.label
            }}</span>
        </button>
      </div>

      <q-input v-if="pesquisa.permiteComentario" v-model="comentario" type="textarea" outlined dense autogrow rows="2"
        counter maxlength="500" placeholder="Quer comentar algo? (opcional)" class="mb-3 text-xs" />

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1 text-[11px] text-gray-500">
          <q-icon name="lock" size="13px" />
          <span>Resposta anônima</span>
        </div>

        <q-btn no-caps unelevated color="primary" size="sm" label="Enviar resposta" icon-right="send"
          class="rounded-lg px-3 font-medium" :disable="nota === null" :loading="enviando" @click="enviar" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { CARINHAS, PERGUNTA_PADRAO } from 'src/helpers/comunicacao/satisfacao';
import { responderPesquisa } from 'src/services/comunicacaoService';
import showNotification from 'src/utils/quasarPlugins/notifyMessage';

const props = defineProps({
  publicacaoId: { type: String, required: true },
  pesquisa: { type: Object, required: true },
});
const emit = defineEmits(['respondida', 'fechar']);

const carinhas = CARINHAS;
const nota = ref(null);
const comentario = ref('');
const enviando = ref(false);
const respondidaAgora = ref(false);

const pergunta = computed(() => props.pesquisa.pergunta || PERGUNTA_PADRAO);
const concluida = computed(
  () => props.pesquisa.jaRespondi || respondidaAgora.value,
);

async function enviar() {
  if (nota.value === null) return;
  enviando.value = true;
  try {
    await responderPesquisa(props.publicacaoId, {
      nota: nota.value,
      comentario: comentario.value || undefined,
    });
    respondidaAgora.value = true;
    emit('respondida');
    showNotification('positive', 'Resposta registrada. Obrigado!', 'top', 2500);
  } catch (e) {
    showNotification('negative', 'Não foi possível enviar. Tente novamente.', 'top', 3000);
  } finally {
    enviando.value = false;
  }
}
</script>
