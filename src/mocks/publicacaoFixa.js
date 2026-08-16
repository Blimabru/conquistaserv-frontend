/**
 * Publicação fixa (hardcoded) do Hackathon Code4City.
 *
 * Fica no topo do feed sem depender do backend: a imagem é servida pelo nginx
 * do front (public/images/) e as interações (lido, reação) são resolvidas em
 * memória, porque o id abaixo não existe no banco.
 *
 * Injetada em src/services/comunicacaoService.js.
 */

export const ID_PUBLICACAO_FIXA = 'fixa-code4city-2026';

// Minutos atrás que a publicação deve aparentar ter. Calculado a cada leitura
// para que dataRelativa() continue exibindo "há 17 minutos" em qualquer sessão,
// em vez de envelhecer a partir de uma data fixa.
const MINUTOS_ATRAS = 17;

const CORPO = `
<p><strong>Vitória da Conquista, BA</strong> — A equipe <strong>BrainstormLabs</strong> foi consagrada como a grande vencedora do <strong>Hackathon Code4City — Programando o Futuro da Cidade</strong>, promovido pela Prefeitura Municipal de Vitória da Conquista, por meio da Secretaria Especial de Transformação Pública (SETP).</p>

<p>O evento reuniu talentos da área de tecnologia em uma jornada de inovação, colaboração e desenvolvimento de soluções voltadas aos desafios reais da administração pública e da população de Vitória da Conquista.</p>

<p>Ao longo do hackathon, a BrainstormLabs se destacou pela capacidade de transformar um problema público em uma solução tecnológica prática, acessível e com potencial de impacto real na cidade. A equipe combinou criatividade, tecnologia e visão de produto para apresentar uma proposta que chamou a atenção dos avaliadores e conquistou o primeiro lugar da competição.</p>

<p>A vitória representa não apenas o reconhecimento do trabalho desenvolvido durante o evento, mas também demonstra o potencial da tecnologia e da inovação como ferramentas para aproximar o poder público dos cidadãos e contribuir para a construção de uma cidade cada vez mais inteligente, eficiente e conectada.</p>

<blockquote class="border-l-4 border-gray-300 pl-4 italic my-3"><p>“Mais do que vencer um hackathon, queremos mostrar que boas ideias, quando unidas à tecnologia e à vontade de transformar a realidade, podem gerar soluções capazes de fazer a diferença na vida das pessoas.”</p></blockquote>

<p>O <strong>Code4City</strong> reforça a importância da participação de estudantes, profissionais e entusiastas de tecnologia na construção de novas ideias para os desafios enfrentados pelo município. A iniciativa também evidencia o compromisso da Prefeitura de Vitória da Conquista com a inovação e com a transformação digital dos serviços públicos.</p>

<p>Com a conquista, a BrainstormLabs encerra o hackathon como símbolo de criatividade, trabalho em equipe e inovação, levando consigo o reconhecimento de ter desenvolvido uma das soluções de maior destaque desta primeira edição do <strong>Code4City</strong>.</p>

<p><strong>BrainstormLabs: programando ideias, desenvolvendo soluções e ajudando a construir o futuro de Vitória da Conquista.</strong></p>
`.trim();

// Estado local das reações — mantido em memória para o card responder ao
// clique sem chamar a API com um id inexistente.
const estado = {
  reacoes: { curtir: 24, parabens: 18, amei: 9, genial: 6 },
  minhaReacao: null,
};

const NOMES_REAGIRAM = [
  'Ana Souza',
  'Carlos Pereira',
  'Beatriz Lima',
  'João Santos',
  'Mariana Costa',
  'Rafael Oliveira',
  'Lucas Ferreira',
  'Gabriel Martins',
];

export function publicacaoFixa() {
  return {
    id: ID_PUBLICACAO_FIXA,
    titulo:
      'BrainstormLabs é a grande vencedora do Hackathon Code4City, promovido pela Prefeitura de Vitória da Conquista',
    resumo:
      'Equipe conquista o 1º lugar do hackathon promovido pela Prefeitura de Vitória da Conquista, por meio da Secretaria Especial de Transformação Pública.',
    corpo: CORPO,
    autor: 'Administrador',
    dataPublicacao: new Date(Date.now() - MINUTOS_ATRAS * 60 * 1000).toISOString(),
    prioridade: 2,
    privada: false,
    reacoesHabilitadas: true,
    // lido: true evita que o card dispare marcarLido() na API.
    lido: true,
    canal: {
      id: 'fixa-comunicados-gerais',
      nome: 'Comunicados Gerais',
      cor: '#045DA5',
      icone: 'campaign',
      oficial: true,
    },
    midias: [
      {
        id: 'fixa-code4city-midia',
        tipo: 'imagem',
        url: '/images/Code4CityBrainstormLabs.jpeg',
        ordem: 0,
      },
    ],
    reacoes: { ...estado.reacoes },
    minhaReacao: estado.minhaReacao,
  };
}

export function reagirFixa(tipo) {
  if (estado.minhaReacao) {
    estado.reacoes[estado.minhaReacao] = Math.max(
      (estado.reacoes[estado.minhaReacao] || 1) - 1,
      0,
    );
  }
  estado.reacoes[tipo] = (estado.reacoes[tipo] || 0) + 1;
  estado.minhaReacao = tipo;
  return publicacaoFixa();
}

export function removerReacaoFixa() {
  if (estado.minhaReacao) {
    estado.reacoes[estado.minhaReacao] = Math.max(
      (estado.reacoes[estado.minhaReacao] || 1) - 1,
      0,
    );
    estado.minhaReacao = null;
  }
  return publicacaoFixa();
}

export function listarReacoesFixa() {
  const lista = [];
  let n = 0;

  Object.entries(estado.reacoes).forEach(([tipo, qtd]) => {
    for (let i = 0; i < qtd; i++) {
      lista.push({
        usuarioId: `fixa-u-${n}`,
        nome: NOMES_REAGIRAM[n % NOMES_REAGIRAM.length],
        tipo,
      });
      n++;
    }
  });

  return lista;
}
