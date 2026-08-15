import { route } from 'quasar/wrappers';
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'src/stores/authStore';

export default route(function (/*{ store, ssrContext }*/) {
  const authStore = useAuthStore();

  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    try {
      const token = window.sessionStorage.getItem('token');
      const accessLevel = window.sessionStorage.getItem('access_level');

      // Se houver token mas a store não estiver inicializada
      if (token && !authStore.isAuthenticated) {
        authStore.initSystem();
      }

      // Se a rota exige login e não há token
      if (to.meta.requiredLogin && !token) {
        next({ name: 'login' });
        return;
      }

      // Se já está autenticado e tenta acessar a página de login
      if (to.path === '/login' && token) {
        next({ path: '/' });
        return;
      }

      // Se a rota exige nível administrativo e o usuário não for ADMIN
      if (to.meta.requiredAdminLevel && accessLevel && accessLevel !== 'ADMIN') {
        next({ path: '/inicio' });
        return;
      }

      next();
    } catch (error) {
      console.error('Erro no router guard:', error);
      next({ name: 'login' });
    }
  });

  return Router;
});
