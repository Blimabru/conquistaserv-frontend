import { api } from 'src/boot/axios';

/**
 * Service para comunicação com a API de AI (Vitória)
 * Endpoints do backend: /api/ai/*
 */
export const vitoriaService = {
  /**
   * Envia uma mensagem para a Vitória e retorna a resposta
   * @param {string} question - A pergunta do usuário
   * @param {string} sessionId - ID da sessão para manter contexto
   * @param {object} context - Contexto adicional (página atual, etc.)
   * @returns {Promise<{answer: string, sessionId: string}>}
   */
  async sendMessage(question, sessionId, context = {}) {
    try {
      const payload = {
        question,
        sessionId,
        context: {
          userName: context.userName,
          currentPage: context.currentPageTitle || context.currentPage
        }
      };

      const { data } = await api.post('ai/chat', payload);
      return {
        answer: data.answer || 'Desculpe, não consegui processar sua pergunta.',
        sessionId: data.sessionId || sessionId,
      };
    } catch (error) {
      console.error('[VitoriaService] Erro ao enviar mensagem:', error);

      // Mensagem de fallback amigável
      if (error.response?.status === 500) {
        return {
          answer: 'Poxa, tive um probleminha técnico aqui! 😅 Tenta de novo daqui a pouquinho, tá?',
          sessionId,
        };
      }

      if (error.response?.status === 401 || error.response?.status === 403) {
        return {
          answer: 'Parece que sua sessão expirou. Faz login novamente pra eu poder te ajudar! 🔐',
          sessionId,
        };
      }

      return {
        answer: 'Hmm, não consegui me conectar agora. Verifica sua internet e tenta de novo! 🌐',
        sessionId,
      };
    }
  },

  /**
   * Envia uma mensagem de áudio para a Vitória e retorna a resposta
   * @param {Blob} audioBlob - O arquivo de áudio gravado
   * @param {string} sessionId - ID da sessão para manter contexto
   * @param {object} context - Contexto adicional (página atual, etc.)
   * @returns {Promise<{answer: string, sessionId: string}>}
   */
  async sendAudioMessage(audioBlob, sessionId, context = {}) {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');
      formData.append('sessionId', sessionId);
      formData.append('context', JSON.stringify({
        userName: context.userName,
        currentPage: context.currentPageTitle || context.currentPage
      }));

      const { data } = await api.post('ai/audio-chat', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return {
        answer: data.answer || 'Desculpe, não consegui processar seu áudio.',
        sessionId: data.sessionId || sessionId,
      };
    } catch (error) {
      console.error('[VitoriaService] Erro ao enviar áudio:', error);
      return {
        answer: 'Hmm, não consegui ouvir direito. Verifica sua internet ou tente gravar novamente! 🎤',
        sessionId,
      };
    }
  },

  /**
   * Busca o histórico de uma sessão
   * @param {string} sessionId
   * @returns {Promise<Array>}
   */
  async getSessionHistory(sessionId) {
    try {
      const { data } = await api.get(`ai/sessions/${sessionId}/history`);
      return data.messages || [];
    } catch (error) {
      console.error('[VitoriaService] Erro ao buscar histórico:', error);
      return [];
    }
  },

  /**
   * Limpa o histórico de uma sessão
   * @param {string} sessionId
   * @returns {Promise<boolean>}
   */
  async clearSession(sessionId) {
    try {
      await api.delete(`ai/sessions/${sessionId}`);
      return true;
    } catch (error) {
      console.error('[VitoriaService] Erro ao limpar sessão:', error);
      return false;
    }
  },
};
