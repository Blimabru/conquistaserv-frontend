export const CARINHAS = [
  { nota: 1, emoji: '😠', label: 'Muito insatisfeito', cor: '#E7000B' },
  { nota: 2, emoji: '🙁', label: 'Insatisfeito', cor: '#E17100' },
  { nota: 3, emoji: '😐', label: 'Neutro', cor: '#F2C037' },
  { nota: 4, emoji: '🙂', label: 'Satisfeito', cor: '#00A63E' },
  { nota: 5, emoji: '😄', label: 'Muito satisfeito', cor: '#045DA5' },
];

export const PERGUNTA_PADRAO = 'Como você se sente sobre esta publicação?';

export function carinhaPorNota(nota) {
  return CARINHAS.find((c) => c.nota === nota) || null;
}
