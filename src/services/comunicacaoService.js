import { api } from 'src/boot/axios';
import * as mock from 'src/mocks/comunicacao.mock';

const USE_MOCK =
  process.env.MOCK_API === 'true' || process.env.MOCK_API === true;

function comDelay(valor, ms = 320) {
  return new Promise((resolve) => setTimeout(() => resolve(valor), ms));
}

export async function listarFeed(params = {}) {
  if (USE_MOCK) return comDelay(mock.listarFeed(params));
  const {
    pagina = 1,
    itensPorPagina = 10,
    busca = '',
    apenasDestaques = false,
  } = params;
  const { data } = await api.get(
    `comunicacao/publicacoes?pagina=${pagina}&itensPorPagina=${itensPorPagina}&busca=${busca}&destaques=${apenasDestaques}`,
  );
  return data;
}

export async function listarPorCanal(canalId, params = {}) {
  if (USE_MOCK) return comDelay(mock.listarPorCanal(canalId, params));
  const { pagina = 1, itensPorPagina = 10, busca = '' } = params;
  const { data } = await api.get(
    `comunicacao/canais/${canalId}/publicacoes?pagina=${pagina}&itensPorPagina=${itensPorPagina}&busca=${busca}`,
  );
  return data;
}

export async function buscarPublicacao(id) {
  if (USE_MOCK) return comDelay(mock.buscarPublicacao(id));
  const { data } = await api.get(`comunicacao/publicacoes/${id}`);
  return data;
}

export async function marcarLido(id) {
  if (USE_MOCK) return comDelay(mock.marcarLido(id), 120);
  const { data } = await api.post(`comunicacao/publicacoes/${id}/lido`);
  return data;
}

export async function reagir(id, tipo) {
  if (USE_MOCK) return comDelay(mock.reagir(id, tipo), 150);
  const { data } = await api.put(`comunicacao/publicacoes/${id}/reacao`, {
    tipo,
  });
  return data;
}

export async function removerReacao(id) {
  if (USE_MOCK) return comDelay(mock.removerReacao(id), 150);
  const { data } = await api.delete(`comunicacao/publicacoes/${id}/reacao`);
  return data;
}

export async function listarReacoes(id) {
  if (USE_MOCK) return comDelay(mock.listarReacoes(id));
  const { data } = await api.get(`comunicacao/publicacoes/${id}/reacoes`);
  return data;
}

export async function responderPesquisa(id, payload) {
  if (USE_MOCK) return comDelay(mock.responderPesquisa(id, payload), 250);
  const { data } = await api.post(
    `comunicacao/publicacoes/${id}/pesquisa`,
    payload,
  );
  return data;
}

export async function listarCanais() {
  if (USE_MOCK) return comDelay(mock.listarCanais());
  const { data } = await api.get('comunicacao/canais');
  return data;
}

export async function buscarCanal(id) {
  if (USE_MOCK) return comDelay(mock.buscarCanal(id));
  const { data } = await api.get(`comunicacao/canais/${id}`);
  return data;
}

export async function seguirCanal(id) {
  if (USE_MOCK) return comDelay(mock.seguirCanal(id), 150);
  const { data } = await api.post(`comunicacao/canais/${id}/inscricao`);
  return data;
}

export async function deixarCanal(id) {
  if (USE_MOCK) return comDelay(mock.deixarCanal(id), 150);
  const { data } = await api.delete(`comunicacao/canais/${id}/inscricao`);
  return data;
}

export async function configurarNotificacao(id, ativo) {
  if (USE_MOCK) return comDelay(mock.configurarNotificacao(id, ativo), 120);
  const { data } = await api.put(`comunicacao/canais/${id}/notificacao`, {
    ativo,
  });
  return data;
}

export async function resumoNaoLidas() {
  if (USE_MOCK) return comDelay(mock.resumoNaoLidas(), 100);
  const { data } = await api.get('comunicacao/nao-lidas');
  return data;
}

export function publicacaoAleatoriaParaNotificar() {
  if (USE_MOCK) return mock.publicacaoAleatoriaParaNotificar();
  return null;
}

export const comunicacaoService = {
  listarFeed,
  listarPorCanal,
  buscarPublicacao,
  marcarLido,
  reagir,
  removerReacao,
  listarReacoes,
  responderPesquisa,
  listarCanais,
  buscarCanal,
  seguirCanal,
  deixarCanal,
  configurarNotificacao,
  resumoNaoLidas,
  publicacaoAleatoriaParaNotificar,
};

export default comunicacaoService;
