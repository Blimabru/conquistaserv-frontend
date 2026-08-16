import { api } from 'boot/axios';

export async function listarSecretarias(pagina = 1, itensPorPagina = 10, busca = '') {
  const { data } = await api.get('/secretarias', {
    params: { pagina, itensPorPagina, busca },
  });
  return data;
}

export async function buscarSecretaria(id) {
  const { data } = await api.get(`/secretarias/${id}`);
  return data;
}

export async function salvarSecretaria(dados, id = null) {
  if (id) {
    const { data } = await api.patch(`/secretarias/${id}`, dados);
    return data;
  }
  const { data } = await api.post('/secretarias', dados);
  return data;
}

export async function deletarSecretaria(id) {
  const { data } = await api.delete(`/secretarias/${id}`);
  return data;
}
