export const TIPOS_REACAO = [
  { tipo: 'curtir', label: 'Curtir', emoji: '👍', cor: 'primary' },
  { tipo: 'amei', label: 'Amei', emoji: '❤️', cor: 'secondary' },
  { tipo: 'parabens', label: 'Parabéns', emoji: '👏', cor: 'positive' },
  { tipo: 'apoio', label: 'Apoio', emoji: '🤝', cor: 'info' },
  { tipo: 'genial', label: 'Genial', emoji: '💡', cor: 'warning' },
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
