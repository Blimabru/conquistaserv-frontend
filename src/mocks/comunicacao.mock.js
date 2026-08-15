
const STORAGE_KEY = 'comunicacao_estado_v1';

const CANAIS_SEED = [
  {
    id: 'secom',
    nome: 'SECOM',
    descricao: 'Comunicação oficial da Prefeitura. Notícias e comunicados gerais.',
    tipo: 'PUBLICO',
    oficial: true,
    cor: 'blue',
    icone: 'campaign',
    souMembroSeed: true,
    notificacoesAtivasSeed: true,
  },
  {
    id: 'rh',
    nome: 'Recursos Humanos',
    descricao: 'Contracheques, benefícios, prazos e informativos do RH.',
    tipo: 'PUBLICO',
    oficial: true,
    cor: 'pink',
    icone: 'groups',
    souMembroSeed: true,
    notificacoesAtivasSeed: true,
  },
  {
    id: 'bem-estar',
    nome: 'Saúde e Bem-estar',
    descricao: 'NAST, campanhas de saúde ocupacional e qualidade de vida.',
    tipo: 'PUBLICO',
    oficial: false,
    cor: 'green',
    icone: 'self_improvement',
    souMembroSeed: true,
    notificacoesAtivasSeed: false,
  },
  {
    id: 'esportes',
    nome: 'Esporte e Lazer',
    descricao: 'Jogos internos, corridas e atividades para servidores.',
    tipo: 'PUBLICO',
    oficial: false,
    cor: 'orange',
    icone: 'sports_soccer',
    souMembroSeed: false,
    notificacoesAtivasSeed: false,
  },
  {
    id: 'inovacao',
    nome: 'Inovação e TI',
    descricao: 'Novidades de sistemas, CETI e transformação digital.',
    tipo: 'PUBLICO',
    oficial: false,
    cor: 'purple',
    icone: 'computer',
    souMembroSeed: false,
    notificacoesAtivasSeed: false,
  },
  {
    id: 'gestores',
    nome: 'Gestores',
    descricao: 'Canal restrito a chefias e coordenações.',
    tipo: 'PRIVADO',
    oficial: false,
    cor: 'amber',
    icone: 'supervisor_account',
    souMembroSeed: true, 
    notificacoesAtivasSeed: true,
  },
  {
    id: 'gabinete',
    nome: 'Gabinete do Prefeito',
    descricao: 'Comunicações estratégicas do gabinete.',
    tipo: 'PRIVADO',
    oficial: false,
    cor: 'grey-9',
    icone: 'account_balance',
    souMembroSeed: false, 
    notificacoesAtivasSeed: false,
  },
];

const PUBLICACOES_SEED = [
  {
    id: 'pub-001',
    ordem: 0,
    canalId: 'secom',
    titulo: 'Novo Portal do Servidor entra no ar',
    resumo:
      'Servidores da PMVC agora contam com um canal único para notícias, contracheque e serviços internos.',
    corpo:
      '<p>A Prefeitura Municipal de Vitória da Conquista lança oficialmente o <strong>ConquistaServ</strong>, o novo portal que reúne em um só lugar comunicação institucional, contracheque online, benefícios e atendimento do NAST.</p><p>O objetivo é acabar com a dispersão de informações em e-mails e memorandos físicos, oferecendo um ponto de entrada moderno, acessível e seguro para os quase 10 mil servidores do município.</p><p>Nas próximas semanas novos módulos serão liberados gradualmente. Fique atento a este canal.</p>',
    midias: [
      {
        tipo: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        poster: 'https://picsum.photos/seed/portal-servidor/1200/675',
      },
    ],
    autor: 'Assessoria de Comunicação',
    dataPublicacao: horasAtras(3),
    prioridade: 100,
    reacoesHabilitadas: true,
    reacoesBase: { curtir: 42, amei: 12, parabens: 18, apoio: 5, genial: 9 },
    pesquisa: {
      pergunta: 'O que você achou do novo portal?',
      escala: 5,
      permiteComentario: true,
    },
  },
  {
    id: 'pub-002',
    ordem: 1,
    canalId: 'rh',
    titulo: 'Contracheque de agosto disponível',
    resumo:
      'O demonstrativo de pagamento referente à competência 08/2026 já pode ser consultado.',
    corpo:
      '<p>O contracheque da competência <strong>agosto/2026</strong> já está disponível para consulta e download em formato PDF na área do servidor.</p><p>Em caso de divergência, abra um chamado junto ao RH em até 5 dias úteis.</p>',
    midias: [],
    autor: 'Diretoria de Recursos Humanos',
    dataPublicacao: horasAtras(20),
    prioridade: 90,
    reacoesHabilitadas: true,
    reacoesBase: { curtir: 30, amei: 4, parabens: 2, apoio: 3, genial: 1 },
    pesquisa: null,
  },
  {
    id: 'pub-003',
    ordem: 2,
    canalId: 'rh',
    titulo: 'Recadastramento anual: prazos e documentos',
    resumo:
      'Confira o calendário do recadastramento obrigatório e a lista de documentos exigidos.',
    corpo:
      '<p>O recadastramento anual dos servidores efetivos ocorrerá entre <strong>1º e 30 de setembro</strong>.</p><ul><li>Documento oficial com foto</li><li>Comprovante de residência atualizado</li><li>Declaração de dependentes, quando houver</li></ul><p>O não cumprimento do prazo pode suspender o pagamento.</p>',
    midias: [],
    autor: 'Diretoria de Recursos Humanos',
    dataPublicacao: diasAtras(2),
    prioridade: 80,
    reacoesHabilitadas: false,
    reacoesBase: {},
    pesquisa: {
      pergunta: 'As orientações do recadastramento ficaram claras?',
      escala: 5,
      permiteComentario: true,
    },
  },
  {
    id: 'pub-004',
    ordem: 3,
    canalId: 'secom',
    titulo: 'Semana do Servidor: programação completa',
    resumo:
      'Palestras, homenagens e atividades de integração de 28 a 31 de outubro.',
    corpo:
      '<p>A tradicional <strong>Semana do Servidor</strong> chega com uma programação especial de valorização profissional.</p><p>Haverá palestras sobre saúde mental, rodas de conversa e uma cerimônia de homenagem aos servidores com mais tempo de casa.</p>',
    midias: [
      { tipo: 'imagem', url: 'https://picsum.photos/seed/semana1/1200/675' },
      { tipo: 'imagem', url: 'https://picsum.photos/seed/semana2/1200/675' },
      { tipo: 'imagem', url: 'https://picsum.photos/seed/semana3/1200/675' },
    ],
    autor: 'Assessoria de Comunicação',
    dataPublicacao: diasAtras(3),
    prioridade: 70,
    reacoesHabilitadas: true,
    reacoesBase: { curtir: 55, amei: 21, parabens: 33, apoio: 8, genial: 4 },
    pesquisa: null,
  },
  {
    id: 'pub-005',
    ordem: 4,
    canalId: 'bem-estar',
    titulo: 'Campanha de vacinação contra a gripe',
    resumo:
      'Imunização gratuita para servidores no ambulatório do NAST durante todo o mês.',
    corpo:
      '<p>O NAST promove a campanha de vacinação contra a gripe para todos os servidores.</p><p>Basta comparecer ao ambulatório com o crachá funcional. Não é necessário agendamento.</p>',
    midias: [
      { tipo: 'imagem', url: 'https://picsum.photos/seed/vacinacao/1200/675' },
    ],
    autor: 'NAST — Núcleo de Atenção à Saúde do Trabalhador',
    dataPublicacao: diasAtras(4),
    prioridade: 40,
    reacoesHabilitadas: true,
    reacoesBase: { curtir: 27, amei: 9, parabens: 3, apoio: 11, genial: 2 },
    pesquisa: {
      pergunta: 'Como avalia a organização da campanha?',
      escala: 5,
      permiteComentario: false,
    },
  },
  {
    id: 'pub-006',
    ordem: 5,
    canalId: 'bem-estar',
    titulo: 'Roda de conversa sobre saúde mental',
    resumo: 'Psicólogas do NAST conduzem encontro aberto na próxima quinta.',
    corpo:
      '<p>Um espaço seguro para falar sobre ansiedade, estresse e equilíbrio entre vida pessoal e trabalho.</p><p>Vagas limitadas — inscreva-se pela Central de Agendamentos.</p>',
    midias: [],
    autor: 'NAST',
    dataPublicacao: diasAtras(5),
    prioridade: 35,
    reacoesHabilitadas: true,
    reacoesBase: { curtir: 14, amei: 6, parabens: 1, apoio: 7, genial: 0 },
    pesquisa: null,
  },
  {
    id: 'pub-007',
    ordem: 6,
    canalId: 'gestores',
    titulo: 'Diretrizes para avaliação de desempenho',
    resumo:
      'Novo fluxo de avaliação das equipes começa a valer no próximo ciclo.',
    corpo:
      '<p>Prezados gestores, o novo modelo de avaliação de desempenho entra em vigor no próximo ciclo.</p><p>O material de apoio e os formulários estão anexos na intranet de chefias.</p>',
    midias: [],
    autor: 'Secretaria de Administração',
    dataPublicacao: diasAtras(6),
    prioridade: 30,
    reacoesHabilitadas: true,
    reacoesBase: { curtir: 8, amei: 0, parabens: 2, apoio: 4, genial: 3 },
    pesquisa: {
      pergunta: 'As novas diretrizes ficaram claras para aplicação?',
      escala: 5,
      permiteComentario: true,
    },
  },
  {
    id: 'pub-008',
    ordem: 7,
    canalId: 'esportes',
    titulo: 'Inscrições abertas para os Jogos dos Servidores',
    resumo: 'Futebol, vôlei e corrida de rua. Monte seu time até o fim do mês.',
    corpo:
      '<p>Estão abertas as inscrições para a edição 2026 dos Jogos dos Servidores.</p><p>Modalidades individuais e coletivas. Participe e represente sua secretaria!</p>',
    midias: [
      { tipo: 'imagem', url: 'https://picsum.photos/seed/jogos2026/1200/675' },
    ],
    autor: 'Comissão de Esportes',
    dataPublicacao: diasAtras(7),
    prioridade: 20,
    reacoesHabilitadas: true,
    reacoesBase: { curtir: 19, amei: 5, parabens: 4, apoio: 2, genial: 1 },
    pesquisa: null,
  },
  {
    id: 'pub-009',
    ordem: 8,
    canalId: 'inovacao',
    titulo: 'CETI apresenta assistente virtual "Conquista"',
    resumo:
      'Inteligência artificial vai ajudar servidores a tirar dúvidas sobre o estatuto.',
    corpo:
      '<p>A Coordenadoria de Tecnologia (CETI) apresenta o assistente virtual <strong>Conquista</strong>, capaz de responder dúvidas sobre direitos, benefícios e processos internos em linguagem simples.</p>',
    midias: [
      {
        tipo: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        poster: 'https://picsum.photos/seed/assistente-ia/1200/675',
      },
    ],
    autor: 'CETI',
    dataPublicacao: diasAtras(9),
    prioridade: 15,
    reacoesHabilitadas: true,
    reacoesBase: { curtir: 23, amei: 8, parabens: 6, apoio: 3, genial: 17 },
    pesquisa: null,
  },
  {
    id: 'pub-010',
    ordem: 9,
    canalId: 'secom',
    titulo: 'Acessibilidade: portal agora tem suporte a Libras',
    resumo:
      'Recursos de alto contraste e VLibras reforçam a inclusão dos servidores PcD.',
    corpo:
      '<p>Pensando nos servidores com deficiência, o ConquistaServ passa a oferecer suporte a <strong>Libras</strong> e modo de <strong>alto contraste</strong>.</p><p>A iniciativa atende à estimativa de centenas de servidores PcD no município.</p>',
    midias: [],
    autor: 'Assessoria de Comunicação',
    dataPublicacao: diasAtras(11),
    prioridade: 25,
    reacoesHabilitadas: true,
    reacoesBase: { curtir: 61, amei: 30, parabens: 15, apoio: 22, genial: 6 },
    pesquisa: {
      pergunta: 'Os recursos de acessibilidade atendem sua necessidade?',
      escala: 5,
      permiteComentario: true,
    },
  },
];

const NOMES_FAKE = [
  'Ana Souza', 'Carlos Lima', 'Beatriz Rocha', 'Daniel Alves', 'Elaine Costa',
  'Fábio Nunes', 'Gabriela Dias', 'Heitor Melo', 'Isadora Reis', 'João Pedro',
  'Karina Luz', 'Lucas Prado', 'Marina Sá', 'Nathan Gomes', 'Otávio Braga',
  'Patrícia Vaz', 'Rafael Pinto', 'Sabrina Teles', 'Tiago Freire', 'Valéria Cruz',
];

function horasAtras(h) {
  return new Date(Date.now() - h * 3600 * 1000).toISOString();
}
function diasAtras(d) {
  return new Date(Date.now() - d * 86400 * 1000).toISOString();
}

function estadoPadrao() {
  return {
    lidos: [], 
    reacoes: {}, 
    pesquisasRespondidas: [], 
    canais: {}, 
  };
}

function carregarEstado() {
  try {
    const bruto = window.sessionStorage.getItem(STORAGE_KEY);
    if (!bruto) return estadoPadrao();
    return { ...estadoPadrao(), ...JSON.parse(bruto) };
  } catch (e) {
    return estadoPadrao();
  }
}

function salvarEstado() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
  } catch (e) {
  }
}

let estado = carregarEstado();

function canalSeedPorId(id) {
  return CANAIS_SEED.find((c) => c.id === id);
}

function resolverCanal(seed) {
  const ov = estado.canais[seed.id] || {};
  return {
    id: seed.id,
    nome: seed.nome,
    descricao: seed.descricao,
    tipo: seed.tipo,
    oficial: seed.oficial,
    cor: seed.cor,
    icone: seed.icone,
    souMembro: ov.souMembro !== undefined ? ov.souMembro : seed.souMembroSeed,
    notificacoesAtivas:
      ov.notificacoesAtivas !== undefined
        ? ov.notificacoesAtivas
        : seed.notificacoesAtivasSeed,
    totalPublicacoes: PUBLICACOES_SEED.filter((p) => p.canalId === seed.id).length,
  };
}

function resolverReacoes(seed) {
  const base = { ...seed.reacoesBase };
  const minha = estado.reacoes[seed.id];
  if (minha) base[minha] = (base[minha] || 0) + 1;
  return base;
}

function resolverPublicacao(seed) {
  const canal = resolverCanal(canalSeedPorId(seed.canalId));
  return {
    id: seed.id,
    canalId: seed.canalId,
    canal: {
      id: canal.id,
      nome: canal.nome,
      cor: canal.cor,
      icone: canal.icone,
      oficial: canal.oficial,
    },
    titulo: seed.titulo,
    resumo: seed.resumo,
    corpo: seed.corpo,
    midias: seed.midias || [],
    autor: seed.autor,
    dataPublicacao: seed.dataPublicacao,
    prioridade: seed.prioridade,
    lido: estado.lidos.includes(seed.id),
    reacoesHabilitadas: seed.reacoesHabilitadas,
    reacoes: resolverReacoes(seed),
    minhaReacao: estado.reacoes[seed.id] || null,
    pesquisa: seed.pesquisa
      ? {
          pergunta: seed.pesquisa.pergunta,
          escala: seed.pesquisa.escala,
          permiteComentario: seed.pesquisa.permiteComentario,
          jaRespondi: estado.pesquisasRespondidas.includes(seed.id),
        }
      : null,
  };
}

function scoreRelevancia(seed) {
  const canal = resolverCanal(canalSeedPorId(seed.canalId));
  const oficial = canal.oficial ? 1_000_000 : 0;
  const tempo = new Date(seed.dataPublicacao).getTime() / 1e9;
  return oficial + seed.prioridade * 1000 + tempo;
}

function paginar(lista, pagina = 1, itensPorPagina = 10) {
  const maxPag = Math.max(1, Math.ceil(lista.length / itensPorPagina));
  const inicio = (pagina - 1) * itensPorPagina;
  return { data: lista.slice(inicio, inicio + itensPorPagina), maxPag };
}

function filtrarBusca(seeds, busca) {
  if (!busca) return seeds;
  const termo = busca.toLowerCase();
  return seeds.filter(
    (s) =>
      s.titulo.toLowerCase().includes(termo) ||
      s.resumo.toLowerCase().includes(termo),
  );
}

export function listarFeed({
  pagina = 1,
  busca = '',
  itensPorPagina = 10,
  apenasDestaques = false,
} = {}) {
  const idsMembro = CANAIS_SEED.filter((c) => resolverCanal(c).souMembro).map(
    (c) => c.id,
  );
  let seeds = PUBLICACOES_SEED.filter((p) => idsMembro.includes(p.canalId));
  if (apenasDestaques) {
    const idsOficiais = CANAIS_SEED.filter((c) => c.oficial).map((c) => c.id);
    seeds = seeds.filter((p) => idsOficiais.includes(p.canalId));
  }
  seeds = filtrarBusca(seeds, busca);
  seeds.sort((a, b) => scoreRelevancia(b) - scoreRelevancia(a));
  const { data, maxPag } = paginar(seeds, pagina, itensPorPagina);
  return { data: data.map(resolverPublicacao), maxPag };
}

export function listarPorCanal(
  canalId,
  { pagina = 1, busca = '', itensPorPagina = 10 } = {},
) {
  let seeds = PUBLICACOES_SEED.filter((p) => p.canalId === canalId);
  seeds = filtrarBusca(seeds, busca);
  seeds.sort(
    (a, b) =>
      new Date(b.dataPublicacao).getTime() - new Date(a.dataPublicacao).getTime(),
  );
  const { data, maxPag } = paginar(seeds, pagina, itensPorPagina);
  return { data: data.map(resolverPublicacao), maxPag };
}

export function buscarPublicacao(id) {
  const seed = PUBLICACOES_SEED.find((p) => p.id === id);
  if (!seed) return null;
  return resolverPublicacao(seed);
}

export function marcarLido(id) {
  if (!estado.lidos.includes(id)) {
    estado.lidos.push(id);
    salvarEstado();
  }
  return { ok: true };
}

export function reagir(id, tipo) {
  estado.reacoes[id] = tipo;
  salvarEstado();
  return buscarPublicacao(id);
}

export function removerReacao(id) {
  delete estado.reacoes[id];
  salvarEstado();
  return buscarPublicacao(id);
}

export function listarReacoes(id) {
  const seed = PUBLICACOES_SEED.find((p) => p.id === id);
  if (!seed) return [];
  const lista = [];
  let n = 0;
  Object.entries(seed.reacoesBase).forEach(([tipo, qtd]) => {
    for (let i = 0; i < qtd; i++) {
      lista.push({
        usuarioId: `u-${seed.ordem}-${n}`,
        nome: NOMES_FAKE[(n + seed.ordem) % NOMES_FAKE.length],
        tipo,
      });
      n++;
    }
  });
  const minha = estado.reacoes[id];
  if (minha) lista.unshift({ usuarioId: 'eu', nome: 'Você', tipo: minha });
  return lista;
}

export function responderPesquisa(id ) {
  if (!estado.pesquisasRespondidas.includes(id)) {
    estado.pesquisasRespondidas.push(id);
    salvarEstado();
  }
  return { ok: true };
}

export function listarCanais() {
  const todos = CANAIS_SEED.map(resolverCanal);
  return {
    meus: todos.filter((c) => c.souMembro),
    disponiveis: todos.filter((c) => !c.souMembro && c.tipo === 'PUBLICO'),
    privados: todos.filter((c) => !c.souMembro && c.tipo === 'PRIVADO'),
  };
}

export function buscarCanal(id) {
  const seed = canalSeedPorId(id);
  return seed ? resolverCanal(seed) : null;
}

export function seguirCanal(id) {
  const seed = canalSeedPorId(id);
  if (!seed || seed.tipo === 'PRIVADO') {
    return { ok: false, motivo: 'Canal privado exige convite.' };
  }
  estado.canais[id] = { ...estado.canais[id], souMembro: true };
  salvarEstado();
  return { ok: true };
}

export function deixarCanal(id) {
  estado.canais[id] = {
    ...estado.canais[id],
    souMembro: false,
    notificacoesAtivas: false,
  };
  salvarEstado();
  return { ok: true };
}

export function configurarNotificacao(id, ativo) {
  estado.canais[id] = { ...estado.canais[id], notificacoesAtivas: !!ativo };
  salvarEstado();
  return { ok: true };
}

export function resumoNaoLidas() {
  const idsMembro = CANAIS_SEED.filter((c) => resolverCanal(c).souMembro).map(
    (c) => c.id,
  );
  const naoLidas = PUBLICACOES_SEED.filter(
    (p) => idsMembro.includes(p.canalId) && !estado.lidos.includes(p.id),
  );
  const porCanal = {};
  naoLidas.forEach((p) => {
    porCanal[p.canalId] = (porCanal[p.canalId] || 0) + 1;
  });
  return { total: naoLidas.length, porCanal };
}

export function publicacaoAleatoriaParaNotificar() {
  const canaisNotif = CANAIS_SEED.map(resolverCanal).filter(
    (c) => c.souMembro && c.notificacoesAtivas,
  );
  if (!canaisNotif.length) return null;
  const canal = canaisNotif[Math.floor(Math.random() * canaisNotif.length)];
  const doCanal = PUBLICACOES_SEED.filter((p) => p.canalId === canal.id);
  if (!doCanal.length) return null;
  const seed = doCanal[Math.floor(Math.random() * doCanal.length)];
  return resolverPublicacao(seed);
}
