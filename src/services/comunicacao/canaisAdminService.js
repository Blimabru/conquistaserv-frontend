import { api } from 'boot/axios';

export async function listarCanais(pagina = 1, itensPorPagina = 10, busca = '') {
  const { data } = await api.get('/comunicacao/canais');

  // O endpoint de leitura ainda não pagina no backend — filtra e pagina no cliente.
  let filtrado = data;
  if (busca) {
    const termo = busca.toLowerCase();
    filtrado = data.filter(
      (c) =>
        c.nome.toLowerCase().includes(termo) ||
        c.descricao.toLowerCase().includes(termo),
    );
  }

  const inicio = (pagina - 1) * itensPorPagina;
  const paginado = filtrado.slice(inicio, inicio + itensPorPagina);

  return {
    data: paginado,
    maxPag: Math.max(1, Math.ceil(filtrado.length / itensPorPagina)),
  };
}

export async function buscarCanal(id) {
  const { data } = await api.get(`/comunicacao/canais/${id}`);
  return data;
}

export async function salvarCanal(dados, id = null) {
  if (id) {
    const { data } = await api.patch(`/comunicacao/canais/${id}`, dados);
    return data;
  }
  const { data } = await api.post('/comunicacao/canais', dados);
  return data;
}

export async function deletarCanal(id) {
  const { data } = await api.delete(`/comunicacao/canais/${id}`);
  return data;
}

export async function listarMembrosCanal(id, pagina = 1, itensPorPagina = 20) {
  const { data } = await api.get(`/comunicacao/canais/${id}/membros`, {
    params: { pagina, itensPorPagina },
  });
  return data;
}

export async function adicionarMembroCanal(canalId, usuarioId) {
  const { data } = await api.post(`/comunicacao/canais/${canalId}/membros`, {
    usuarioId,
  });
  return data;
}

export async function removerMembroCanal(canalId, usuarioId) {
  const { data } = await api.delete(
    `/comunicacao/canais/${canalId}/membros/${usuarioId}`,
  );
  return data;
}
