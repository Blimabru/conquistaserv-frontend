import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { Notify, Loading, QSpinnerBall } from 'quasar';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    idUser: window.sessionStorage.getItem('user_id') || '',
    nameUser: window.sessionStorage.getItem('name_user') || '',
    token: window.sessionStorage.getItem('token') || '',
    isAuthenticated: !!window.sessionStorage.getItem('token'),
    isAdmin: window.sessionStorage.getItem('access_level') === 'ADMIN',
  }),

  actions: {
    async doLogin(payload) {
      Loading.show({
        message: 'Entrando em contato com servidor...',
        delay: 400,
        spinner: QSpinnerBall,
        spinnerColor: 'blue-10',
        spinnerSize: 140,
      });
      try {
        const response = await api.post('/auth/login', payload);
        const accessToken = response.data?.accessToken || response.data?.token || response.data;

        if (!accessToken) {
          throw new Error('Token não retornado pelo servidor');
        }

        this.setToken(accessToken);
        api.defaults.headers.common.Authorization = 'Bearer ' + accessToken;

        // Busca dados do usuário após login
        try {
          await this.getUserAccessLevel(accessToken);
        } catch (e) {
          console.warn('Não foi possível obter dados imediatos de perfil:', e);
        }

        Notify.create({
          color: 'green-10',
          icon: 'done_all',
          position: 'top',
          timeout: 2000,
          message: 'Bem vindo de volta',
        });

        Loading.hide();
        return response;
      } catch (error) {
        console.log('Erro ao fazer login', error);
        Loading.hide();
        Notify.create({
          color: 'negative',
          icon: 'close',
          position: 'top',
          timeout: 2500,
          message: error?.response?.data?.message || 'Usuário ou senha incorretos',
        });
        throw error;
      }
    },

    setToken(token) {
      this.token = token;
      this.isAuthenticated = !!token;
      if (token) {
        window.sessionStorage.setItem('token', token);
      } else {
        window.sessionStorage.removeItem('token');
      }
    },

    setUser(userId, userName = '') {
      this.idUser = userId;
      this.nameUser = userName;
      if (userId) {
        window.sessionStorage.setItem('user_id', userId);
      }
      if (userName) {
        window.sessionStorage.setItem('name_user', userName);
      }
    },

    setAccessLevel(level) {
      this.isAdmin = level === 'ADMIN';
      if (level) {
        window.sessionStorage.setItem('access_level', level);
      } else {
        window.sessionStorage.removeItem('access_level');
      }
    },

    removeToken() {
      this.token = '';
      this.isAuthenticated = false;
      window.sessionStorage.removeItem('token');
    },

    removeUser() {
      this.idUser = '';
      this.nameUser = '';
      window.sessionStorage.removeItem('user_id');
      window.sessionStorage.removeItem('name_user');
    },

    removeAccessLevel() {
      this.isAdmin = false;
      window.sessionStorage.removeItem('access_level');
    },

    async initSystem() {
      const token = window.sessionStorage.getItem('token');
      if (token) {
        this.setToken(token);
        const accessLevel = window.sessionStorage.getItem('access_level');
        if (accessLevel) {
          this.setAccessLevel(accessLevel);
        }
        const userId = window.sessionStorage.getItem('user_id');
        const userName = window.sessionStorage.getItem('name_user');
        if (userId) {
          this.setUser(userId, userName || '');
        }
      } else {
        this.logout();
      }
    },

    async getUserAccessLevel(payloadToken) {
      const token = payloadToken || this.token || window.sessionStorage.getItem('token');
      if (!token) return '';

      api.defaults.headers.common.Authorization = 'Bearer ' + token;
      const { data } = await api.get('usuarios/me');

      if (data) {
        this.setAccessLevel(data.nivel);
        this.setUser(data.id, data.nome);
        return data.nivel;
      }
      return '';
    },

    logout() {
      api.defaults.headers.common.Authorization = '';
      this.removeUser();
      this.removeToken();
      this.removeAccessLevel();
    },
  },
});
