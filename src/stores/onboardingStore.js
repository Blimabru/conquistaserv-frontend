import { defineStore } from 'pinia';
import { useAuthStore } from './authStore';

export const ONBOARDING_STEPS = [
  {
    route: '/documentos',
    target: 'documentos-secao',
    title: 'Sessão de Documentos',
    description: 'Visualize todos documentos cadastrados e organizados pelo portal.',
  },
  {
    route: '/documentos',
    target: 'documentos-card-0',
    title: 'Documentos cadastrados.',
    description: 'Busque, visualize e baixe documentos cadastrados no portal.',
  },
  {
    route: '/comunicacao',
    target: 'comunicacao-feed',
    title: 'Comunicação',
    description: 'Acompanhe publicações, canais e avisos oficiais da prefeitura.',
  },
  {
    route: '/beneficios',
    target: 'beneficios-secao',
    title: 'Benefícios',
    description: 'Confira e solicite os benefícios disponíveis para o seu perfil.',
  },
  {
    route: '/servicos',
    target: 'servicos-secao',
    title: 'Serviços',
    description: 'Encontre e acompanhe os serviços oferecidos pela prefeitura.',
  },
];

export const useOnboardingStore = defineStore('onboarding', {
  state: () => ({
    active: false,
    currentStep: 0,
    steps: ONBOARDING_STEPS,
  }),

  getters: {
    total: (state) => state.steps.length,
    step: (state) => state.steps[state.currentStep] || null,
    isFirstStep: (state) => state.currentStep === 0,
    isLastStep: (state) => state.currentStep === state.steps.length - 1,
  },

  actions: {
    async start(router) {
      this.currentStep = 0;
      this.active = true;
      await this._goToStepRoute(router);
    },

    async next(router) {
      if (this.isLastStep) {
        await this.finish();
        return;
      }
      this.currentStep += 1;
      await this._goToStepRoute(router);
    },

    async prev(router) {
      if (this.isFirstStep) return;
      this.currentStep -= 1;
      await this._goToStepRoute(router);
    },

    async skip() {
      this.active = false;
      const authStore = useAuthStore();
      await authStore.concluiOnboarding();
    },

    async finish() {
      this.active = false;
      const authStore = useAuthStore();
      await authStore.concluiOnboarding();
    },

    async _goToStepRoute(router) {
      const targetRoute = this.step?.route;
      if (!targetRoute || !router) return;
      if (router.currentRoute.value.path === targetRoute) return;

      try {
        await router.push(targetRoute);
      } catch (erro) {
        const tipo = erro?.type;
        const ehAbortoEsperado =
          tipo === 4 ||
          tipo === 8 ||
          tipo === 16 ||
          tipo === 2;

        if (!ehAbortoEsperado) {
          console.error('Onboarding: falha ao navegar para', targetRoute, erro);
        }
      }
    },
  },
});
