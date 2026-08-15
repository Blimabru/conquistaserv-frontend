export const TIPOS_REACAO = [
  { tipo: 'curtir', label: 'Curtir', icone: 'thumb_up', cor: 'primary' },
  { tipo: 'amei', label: 'Amei', icone: 'favorite', cor: 'negative' },
  { tipo: 'parabens', label: 'Parabéns', icone: 'celebration', cor: 'positive' },
  { tipo: 'apoio', label: 'Apoio', icone: 'handshake', cor: 'info' },
  { tipo: 'genial', label: 'Genial', icone: 'lightbulb', cor: 'warning' },
];

export const MAPA_REACAO = TIPOS_REACAO.reduce((acc, r) => {
  acc[r.tipo] = r;
  return acc;
}, {});

export function totalReacoes(reacoes = {}) {
  return Object.values(reacoes).reduce((soma, n) => soma + (n || 0), 0);
}

export function reacoesPresentes(reacoes = {}) {
  return Object.entries(reacoes)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([tipo, quantidade]) => ({ ...MAPA_REACAO[tipo], quantidade }))
    .filter((r) => r.tipo);
}
