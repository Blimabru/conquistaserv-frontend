import { api } from 'boot/axios';

export async function listarBeneficios(pagina = 1, itensPorPagina = 10, busca = '') {
  const { data } = await api.get('/beneficios');

  // O endpoint de leitura não pagina no backend (baixo volume) — filtra e pagina no cliente.
  let filtrado = data;
  if (busca) {
    const termo = busca.toLowerCase();
    filtrado = data.filter(
      (b) =>
        b.titulo.toLowerCase().includes(termo) ||
        (b.descricao || '').toLowerCase().includes(termo),
    );
  }

  const inicio = (pagina - 1) * itensPorPagina;
  const paginado = filtrado.slice(inicio, inicio + itensPorPagina);

  return {
    data: paginado,
    maxPag: Math.max(1, Math.ceil(filtrado.length / itensPorPagina)),
  };
}

export async function buscarBeneficio(id) {
  const { data } = await api.get(`/beneficios/${id}`);
  return data;
}

export async function salvarBeneficio(dados, id = null) {
  if (id) {
    const { data } = await api.patch(`/beneficios/${id}`, dados);
    return data;
  }
  const { data } = await api.post('/beneficios', dados);
  return data;
}

export async function deletarBeneficio(id) {
  const { data } = await api.delete(`/beneficios/${id}`);
  return data;
}
