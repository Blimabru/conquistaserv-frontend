import { api } from 'src/boot/axios';

const PREFIX = '/feedbacks';

export const feedbackService = {
  /**
   * Obtém métricas agregadas dos feedbacks
   * @param {number} dias Filtro opcional por dias (ex: 7, 30, 90)
   */
  async getMetrics(dias) {
    const params = {};
    if (dias) params.dias = dias;
    
    const response = await api.get(`${PREFIX}/metrics`, { params });
    return response.data;
  },

  /**
   * Lista os feedbacks mais recentes
   * @param {number} dias Filtro opcional por dias
   * @param {number} limit Limite de registros (default 10)
   */
  async getRecentes(dias, limit = 10) {
    const params = { limit };
    if (dias) params.dias = dias;
    
    const response = await api.get(`${PREFIX}/recentes`, { params });
    return response.data;
  }
};
