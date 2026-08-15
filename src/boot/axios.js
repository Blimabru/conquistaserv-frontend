import { boot } from 'quasar/wrappers';
import axios from 'axios';

const api = axios.create({ baseURL: process.env.API_BASE_URL });

// Interceptor para injetar o token de autorização em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = window.sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
