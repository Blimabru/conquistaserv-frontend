import { api } from 'boot/axios';

export async function listarDocumentos(pagina = 1, itensPorPagina = 10, busca = '') {
  const { data } = await api.get('/documentos', {
    params: { pagina, itensPorPagina, busca },
  });
  return data;
}

export async function buscarDocumento(id) {
  const { data } = await api.get(`/documentos/${id}`);
  return data;
}

export async function salvarDocumento(dados, id = null) {
  if (id) {
    const { data } = await api.patch(`/documentos/${id}`, dados);
    return data;
  }
  const { data } = await api.post('/documentos', dados);
  return data;
}

export async function deletarDocumento(id) {
  const { data } = await api.delete(`/documentos/${id}`);
  return data;
}
