import { api } from 'boot/axios';

export async function listarPublicacoes(
  canalId = null,
  pagina = 1,
  itensPorPagina = 10,
  busca = '',
) {
  // Sem canalId: lista todas as publicações do sistema (admin vê tudo, ver publicacoes.service.ts no backend).
  const endpoint = canalId
    ? `/comunicacao/canais/${canalId}/publicacoes`
    : '/comunicacao/publicacoes';
  const { data } = await api.get(endpoint, {
    params: { pagina, itensPorPagina, busca },
  });
  return data;
}

export async function buscarPublicacao(id) {
  const { data } = await api.get(`/comunicacao/publicacoes/${id}`);
  return data;
}

export async function salvarPublicacao(dados, id = null) {
  if (id) {
    const { data } = await api.patch(`/comunicacao/publicacoes/${id}`, dados);
    return data;
  }
  const { data } = await api.post('/comunicacao/publicacoes', dados);
  return data;
}

export async function deletarPublicacao(id) {
  const { data } = await api.delete(`/comunicacao/publicacoes/${id}`);
  return data;
}

export async function analyticsPublicacao(id) {
  const { data } = await api.get(`/comunicacao/publicacoes/${id}/analytics`);
  return data;
}
