<template>
  <!-- Floating Action Button -->
  <button
    v-show="!vitoriaStore.isOpen"
    class="vitoria-fab"
    :class="{ 'vitoria-fab--hidden': vitoriaStore.isOpen }"
    @click="vitoriaStore.openChat()"
    aria-label="Abrir assistente Vitória"
  >
    <div class="vitoria-fab__inner">
      <div class="vitoria-fab__blob"></div>
      <div class="vitoria-fab__text">
        <span class="vitoria-fab__title">Vitória</span>
        <span class="vitoria-fab__subtitle">Assistente Inteligente</span>
      </div>
    </div>
  </button>

  <!-- Chat Popup -->
  <Transition name="vitoria-popup">
    <div v-if="vitoriaStore.isOpen" class="vitoria-popup">

      <!-- ====== VOICE MODE (tela cheia centralizada) ====== -->
      <template v-if="isVoiceMode">
        <div class="vitoria-voice-screen">
          <h2 class="vitoria-voice-screen__title">Vitória</h2>
          <p class="vitoria-voice-screen__subtitle">
            {{ isAiSpeaking ? 'Falando...' : (isListening ? 'Ouvindo você...' : 'Modo de voz') }}
          </p>
          <div
            class="vitoria-voice-screen__blob"
            :class="{
              'vitoria-voice-screen__blob--speaking': isAiSpeaking,
              'vitoria-voice-screen__blob--listening': isListening
            }"
          ></div>
          <button class="vitoria-voice-screen__close" @click="toggleVoiceMode">
            <q-icon name="close" size="22px" />
          </button>
        </div>

        <!-- Input personalizado do modo de voz -->
        <div class="vitoria-input">
          <div class="vitoria-input__wrapper vitoria-input__wrapper--voice">
            <span class="vitoria-input__voice-label">Modo de voz ativo</span>
            <button class="vitoria-input__stop" @click="toggleVoiceMode">
              <q-icon name="stop_circle" />
            </button>
          </div>
        </div>
      </template>

      <!-- ====== WELCOME SCREEN ====== -->
      <template v-else-if="!vitoriaStore.hasInteracted">
        <div class="vitoria-welcome">
          <button class="vitoria-welcome__close" @click="vitoriaStore.closeChat()" aria-label="Fechar">
            <q-icon name="close" size="22px" />
          </button>
          <h2 class="vitoria-welcome__title">Vitória</h2>
          <p class="vitoria-welcome__subtitle">
            A inteligência artificial que<br>conhece o servidor.
          </p>
          <div class="vitoria-welcome__blob"></div>
        </div>

        <!-- Input -->
        <div class="vitoria-input">
          <div class="vitoria-input__wrapper">
            <input
              ref="welcomeInput"
              v-model="inputText"
              class="vitoria-input__field"
              type="text"
              placeholder="Tire sua dúvida."
              @keydown.enter="sendMessage"
            />
            <button
              class="vitoria-input__voice"
              @click="toggleVoiceMode"
              aria-label="Conversar por voz">
              <q-icon name="record_voice_over" />
            </button>
            <button
              v-if="!inputText.trim() || isRecording"
              class="vitoria-input__mic"
              :class="{'vitoria-input__mic--active': isRecording}"
              @click="toggleMic"
              aria-label="Microfone">
              <q-icon name="mic" />
            </button>
            <button
              v-else
              class="vitoria-input__send"
              :disabled="vitoriaStore.isLoading"
              @click="sendMessage"
              aria-label="Enviar"
            >
              <q-icon name="send" />
            </button>
          </div>
        </div>
      </template>

      <!-- ====== CHAT SCREEN ====== -->
      <template v-else>
        <!-- Header -->
        <div class="vitoria-header">
          <div class="vitoria-header__blob"></div>
          <div class="vitoria-header__info">
            <p class="vitoria-header__name">Vitória</p>
            <p class="vitoria-header__tagline">A assistente de quem serve a sociedade.</p>
          </div>
          <button
            class="vitoria-header__close"
            @click="vitoriaStore.closeChat()"
            aria-label="Fechar chat"
          >
            <q-icon name="close" />
          </button>
        </div>

        <!-- Messages -->
        <div ref="messagesContainer" class="vitoria-messages" @click="handleLinkClick">
          <div
            v-for="(msg, index) in vitoriaStore.messages"
            :key="index"
            class="vitoria-msg"
            :class="'vitoria-msg--' + msg.role"
          >
            <!-- Avatar só para assistente -->
            <div v-if="msg.role === 'assistant'" class="vitoria-msg__avatar"></div>

            <div v-if="msg.type === 'audio'" class="vitoria-msg__bubble bg-transparent !p-0">
              <audio :src="msg.audioUrl" controls class="w-full max-w-[220px]" style="height: 40px;"></audio>
            </div>
            <div v-else class="vitoria-msg__bubble" v-html="formatMessage(msg.content)">
            </div>
          </div>

          <!-- Thinking indicator -->
          <div v-if="vitoriaStore.isLoading" class="vitoria-thinking">
            <div class="vitoria-thinking__orb"></div>
            <span class="vitoria-thinking__text">A Vitória está pensando...</span>
          </div>
        </div>

        <!-- Clear chat -->
        <div class="vitoria-clear">
          <button class="vitoria-clear__btn" @click="clearChat">
            Limpar conversa
          </button>
        </div>

        <!-- Input -->
        <div class="vitoria-input">
          <div class="vitoria-input__wrapper">
            <input
              ref="chatInput"
              v-model="inputText"
              class="vitoria-input__field"
              type="text"
              placeholder="Tire sua dúvida."
              @keydown.enter="sendMessage"
            />
            <button
              class="vitoria-input__voice"
              @click="toggleVoiceMode"
              aria-label="Conversar por voz">
              <q-icon name="record_voice_over" />
            </button>
            <button
              v-if="!inputText.trim() || isRecording"
              class="vitoria-input__mic"
              :class="{'vitoria-input__mic--active': isRecording}"
              @click="toggleMic"
              aria-label="Microfone">
              <q-icon name="mic" />
            </button>
            <button
              v-else
              class="vitoria-input__send"
              :disabled="vitoriaStore.isLoading"
              @click="sendMessage"
              aria-label="Enviar"
            >
              <q-icon name="send" />
            </button>
          </div>
        </div>
      </template>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useVitoriaStore } from 'src/stores/vitoriaStore';
import { useAuthStore } from 'src/stores/authStore';
import { vitoriaService } from 'src/services/vitoriaService';
import { marked } from 'marked';

const route = useRoute();
const vitoriaStore = useVitoriaStore();
const authStore = useAuthStore();
const router = useRouter();

const inputText = ref('');
const messagesContainer = ref(null);
const welcomeInput = ref(null);
const chatInput = ref(null);

// Voice and Speech state
const isVoiceMode = ref(false);
const isAiSpeaking = ref(false);
const isRecording = ref(false);
let mediaRecorder = null;
let audioChunks = [];

// Mapa de rotas para nomes legíveis
const pageNameMap = {
  '/inicio': 'Início',
  '/admin/dashboard': 'Dashboard Admin',
  '/admin/secretarias': 'Secretarias',
  '/admin/comunicacao/publicacoes': 'Publicações',
  '/admin/comunicacao/canais': 'Canais',
  '/admin/servicos': 'Serviços',
  '/admin/documentos': 'Documentos',
  '/admin/beneficios': 'Benefícios',
  '/admin/usuarios': 'Usuários',
  '/comunicacao': 'Comunicação',
  '/beneficios': 'Benefícios',
  '/documentos': 'Documentos',
  '/servicos': 'Serviços',
  '/perfil': 'Perfil',
  '/feedback': 'Feedback',
};

// Rastreia a página atual do usuário
function updateCurrentPage() {
  const path = route.path;
  const title = pageNameMap[path] || route.meta?.title || path;
  vitoriaStore.setCurrentPage(path, title);
}

// Watch route changes
watch(() => route.path, () => {
  updateCurrentPage();
});

// Focar input sempre que o popup abrir, e adicionar listener de teclado
onMounted(() => {
  updateCurrentPage();
  window.addEventListener('keydown', handleGlobalKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
  if (isListening.value && recognition) recognition.stop();
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
});

// Auto-scroll para a última mensagem
watch(
  () => vitoriaStore.messages.length,
  async () => {
    await nextTick();
    scrollToBottom();
  }
);

// Auto-scroll quando loading muda
watch(
  () => vitoriaStore.isLoading,
  async () => {
    await nextTick();
    scrollToBottom();
  }
);

watch(() => vitoriaStore.isOpen, async (isOpen) => {
  if (isOpen) {
    await nextTick();
    if (!isVoiceMode.value) {
      if (vitoriaStore.hasInteracted && chatInput.value) {
        chatInput.value.focus();
      } else if (!vitoriaStore.hasInteracted && welcomeInput.value) {
        welcomeInput.value.focus();
      }
    }
  } else {
    // Se fechar, interrompe qualquer fala e microfone
    if (isVoiceMode.value) {
      toggleVoiceMode(); // desativa e para tudo
    }
  }
});

function handleGlobalKeydown(e) {
  if (e.key === 'Escape' && vitoriaStore.isOpen) {
    if (isVoiceMode.value) {
      toggleVoiceMode(); // se tiver no modo voz, sai dele primeiro
    } else {
      vitoriaStore.closeChat(); // se não, fecha o popup
    }
  }
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

async function sendMessage() {
  const text = inputText.value.trim();
  if (!text || vitoriaStore.isLoading) return;

  // Adiciona mensagem do usuário
  vitoriaStore.addUserMessage(text);
  inputText.value = '';

  // Focus no input do chat (caso venha do welcome)
  await nextTick();
  if (chatInput.value) {
    chatInput.value.focus();
  }

  // Mostra indicador de carregamento
  vitoriaStore.setLoading(true);

  try {
    const response = await vitoriaService.sendMessage(
      text,
      vitoriaStore.sessionId,
      {
        currentPage: vitoriaStore.currentPage,
        currentPageTitle: vitoriaStore.currentPageTitle,
        userName: authStore.nameUser
      }
    );

    vitoriaStore.setLoading(false);

    // Separa a resposta em pedaços usando o delimitador |||
    const chunks = response.answer.split('|||').map(s => s.trim()).filter(s => s);
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      
      // Se não for a primeira bolha, liga o "Pensando..." simulando digitação
      if (i > 0) {
        vitoriaStore.setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        vitoriaStore.setLoading(false);
      }
      
      vitoriaStore.addAssistantMessage(chunk);
      
      if (isVoiceMode.value) {
        speakText(chunk);
      }
    }
  } catch (error) {
    vitoriaStore.setLoading(false);
    console.error('[VitoriaChat] Erro inesperado:', error);
    const errorMsg = 'Poxa, tive um probleminha técnico aqui! 😅 Tenta de novo daqui a pouquinho, tá?';
    vitoriaStore.addAssistantMessage(errorMsg);
    if (isVoiceMode.value) speakText(errorMsg);
  }
}

async function clearChat() {
  try {
    await vitoriaService.clearSession(vitoriaStore.sessionId);
  } catch {
    // silently fail
  }
  vitoriaStore.clearMessages();
}

/**
 * Formata a mensagem para exibição usando Markdown parser
 */
function formatMessage(text) {
  if (!text) return '';
  // Corrige problema comum da IA inserir espaço indesejado no markdown
  const sanitizedText = text.replace(/\]\s+\(/g, '](');
  return marked.parse(sanitizedText);
}

// Navegação em links internos injetados pela IA
function handleLinkClick(event) {
  const target = event.target.closest('a');
  if (target) {
    const href = target.getAttribute('href');
    if (href && href.startsWith('/')) {
      event.preventDefault();
      router.push(href);
      vitoriaStore.closeChat(); // Fecha o chat após redirecionar
    }
  }
}

// ==== Text-to-Speech (Voz da I.A) ====
function toggleVoiceMode() {
  isVoiceMode.value = !isVoiceMode.value;
  if (!isVoiceMode.value) {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (isRecording.value && mediaRecorder) toggleMic();
  } else {
    if (!isRecording.value) toggleMic();
  }
}

function speakText(text) {
  if (!isVoiceMode.value || !('speechSynthesis' in window)) return;

  // Limpa o HTML do texto para falar apenas o conteúdo
  const cleanText = text.replace(/<[^>]+>/g, '');
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'pt-BR';
  
  const voices = window.speechSynthesis.getVoices();
  const ptVoices = voices.filter(v => v.lang.startsWith('pt'));
  
  if (ptVoices.length > 0) {
    // Tenta encontrar uma voz feminina agradável, ou pega a primeira disponível
    utterance.voice = ptVoices.find(v => v.name.includes('Google') || v.name.includes('Luciana') || v.name.includes('Female')) || ptVoices[0];
  }

  utterance.onstart = () => { isAiSpeaking.value = true; };
  utterance.onend = () => { isAiSpeaking.value = false; };
  utterance.onerror = () => { isAiSpeaking.value = false; };

  window.speechSynthesis.speak(utterance);
}

// Garante que as vozes sejam carregadas no Chrome
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

// ==== Gravação de Áudio e Reconhecimento Visual ====
let recognition = null;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'pt-BR';
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    if (!isRecording.value) return;
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join('');
    inputText.value = transcript;
  };
}

async function toggleMic() {
  if (isRecording.value && mediaRecorder) {
    mediaRecorder.stop();
    if (recognition) recognition.stop();
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    inputText.value = ''; // Limpa para mostrar a transcrição

    if (recognition) {
      try { recognition.start(); } catch(e) { console.error('Erro no recognition:', e); }
    }

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);
      isRecording.value = false;
      
      // Para as faixas do microfone
      stream.getTracks().forEach(track => track.stop());

      const finalTranscript = inputText.value.trim();
      inputText.value = ''; // limpa a barra de digitação ao enviar

      // Adiciona mensagem localmente
      vitoriaStore.addUserMessage(finalTranscript || 'Áudio enviado', 'audio', audioUrl);
      vitoriaStore.setLoading(true);

      try {
        const response = await vitoriaService.sendAudioMessage(
          audioBlob,
          vitoriaStore.sessionId,
          {
            currentPage: vitoriaStore.currentPage,
            currentPageTitle: vitoriaStore.currentPageTitle,
            userName: authStore.nameUser
          }
        );

        vitoriaStore.setLoading(false);

        const chunks = response.answer.split('|||').map(s => s.trim()).filter(s => s);
        for (let i = 0; i < chunks.length; i++) {
          if (i > 0) {
            vitoriaStore.setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1500));
            vitoriaStore.setLoading(false);
          }
          vitoriaStore.addAssistantMessage(chunks[i]);
          if (isVoiceMode.value) speakText(chunks[i]);
        }
      } catch (error) {
        vitoriaStore.setLoading(false);
        const errorMsg = 'Poxa, tive um probleminha para ouvir seu áudio. Pode tentar de novo?';
        vitoriaStore.addAssistantMessage(errorMsg);
        if (isVoiceMode.value) speakText(errorMsg);
      }
    };

    mediaRecorder.start();
    isRecording.value = true;
  } catch (error) {
    console.error('Erro ao acessar microfone:', error);
    alert('Não foi possível acessar seu microfone. Verifique as permissões.');
  }
}

// Atalho de teclado para fechar (Escape)
function handleKeydown(e) {
  if (e.key === 'Escape' && vitoriaStore.isOpen) {
    vitoriaStore.closeChat();
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>
