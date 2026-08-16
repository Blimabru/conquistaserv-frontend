import { defineStore } from 'pinia';

export const useVitoriaStore = defineStore('vitoria', {
  state: () => ({
    isOpen: false,
    isLoading: false,
    hasInteracted: false,
    sessionId: window.sessionStorage.getItem('vitoria_session_id') || generateSessionId(),
    currentPage: '/',
    currentPageTitle: 'Início',
    messages: [],
  }),

  getters: {
    messageCount: (state) => state.messages.length,
  },

  actions: {
    toggleChat() {
      this.isOpen = !this.isOpen;
    },

    openChat() {
      this.isOpen = true;
    },

    closeChat() {
      this.isOpen = false;
    },

    setCurrentPage(path, title) {
      this.currentPage = path;
      this.currentPageTitle = title || path;
    },

    addUserMessage(content, type = 'text', audioUrl = null) {
      this.messages.push({
        role: 'user',
        content,
        type,
        audioUrl,
        timestamp: new Date().toISOString(),
      });
      this.hasInteracted = true;
    },

    addAssistantMessage(content) {
      this.messages.push({
        role: 'assistant',
        content,
        timestamp: new Date().toISOString(),
      });
    },

    setLoading(value) {
      this.isLoading = value;
    },

    clearMessages() {
      this.messages = [];
      this.hasInteracted = false;
      this.sessionId = generateSessionId();
      window.sessionStorage.setItem('vitoria_session_id', this.sessionId);
    },

    persistSessionId() {
      window.sessionStorage.setItem('vitoria_session_id', this.sessionId);
    },
  },
});

function generateSessionId() {
  const id = 'vitoria-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
  window.sessionStorage.setItem('vitoria_session_id', id);
  return id;
}
