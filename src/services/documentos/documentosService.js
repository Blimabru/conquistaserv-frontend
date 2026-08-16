import { api } from 'boot/axios';

// Leitura pública (usuário comum e admin) — usada pela tela de exibição /documentos.
export async function listarDocumentos(itensPorPagina = 50) {
  const { data } = await api.get('/documentos', {
    params: { pagina: 1, itensPorPagina },
  });
  return data.data;
}

export async function listarDocumentosRecentes(limite = 4) {
  const { data } = await api.get('/documentos/recentes', { params: { limite } });
  return data;
}
