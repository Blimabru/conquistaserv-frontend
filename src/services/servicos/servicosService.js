import { api } from 'boot/axios';

// Leitura pública (usuário comum e admin) — usada pela tela de exibição /servicos.
export async function listarServicos() {
  const { data } = await api.get('/servicos');
  return data;
}

export async function listarServicosAcessoRapido() {
  const { data } = await api.get('/servicos/acesso-rapido');
  return data;
}
