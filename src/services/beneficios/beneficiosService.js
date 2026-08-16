import { api } from 'boot/axios';

// Leitura pública (usuário comum e admin) — usada pela tela de exibição /beneficios.
export async function listarBeneficios() {
  const { data } = await api.get('/beneficios');
  return data;
}
