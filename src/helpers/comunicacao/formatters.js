
export function formatarData(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function dataRelativa(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';

  const segundos = Math.floor((Date.now() - d.getTime()) / 1000);
  if (segundos < 45) return 'agora';

  const faixas = [
    { limite: 3600, div: 60, sing: 'minuto', plur: 'minutos' },
    { limite: 86400, div: 3600, sing: 'hora', plur: 'horas' },
    { limite: 604800, div: 86400, sing: 'dia', plur: 'dias' },
    { limite: 2592000, div: 604800, sing: 'semana', plur: 'semanas' },
  ];

  for (const f of faixas) {
    if (segundos < f.limite) {
      const valor = Math.floor(segundos / f.div);
      return `há ${valor} ${valor === 1 ? f.sing : f.plur}`;
    }
  }
  return formatarData(iso).split(' ')[0];
}

export function pluralizar(n, singular, plural) {
  return n === 1 ? singular : plural;
}
