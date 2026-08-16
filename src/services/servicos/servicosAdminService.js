import { api } from 'boot/axios';

export async function listarServicos(pagina = 1, itensPorPagina = 10, busca = '') {
  const { data } = await api.get('/servicos');

  // O endpoint de leitura não pagina no backend (baixo volume) — filtra e pagina no cliente.
  let filtrado = data;
  if (busca) {
    const termo = busca.toLowerCase();
    filtrado = data.filter(
      (s) =>
        s.nome.toLowerCase().includes(termo) ||
        (s.descricao || '').toLowerCase().includes(termo),
    );
  }

  const inicio = (pagina - 1) * itensPorPagina;
  const paginado = filtrado.slice(inicio, inicio + itensPorPagina);

  return {
    data: paginado,
    maxPag: Math.max(1, Math.ceil(filtrado.length / itensPorPagina)),
  };
}

export async function buscarServico(id) {
  const { data } = await api.get(`/servicos/${id}`);
  return data;
}

export async function salvarServico(dados, id = null) {
  if (id) {
    const { data } = await api.patch(`/servicos/${id}`, dados);
    return data;
  }
  const { data } = await api.post('/servicos', dados);
  return data;
}

export async function deletarServico(id) {
  const { data } = await api.delete(`/servicos/${id}`);
  return data;
}
