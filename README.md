# ConquistaServ — Front-End

Interface web do sistema **ConquistaServ**, desenvolvida com [Quasar Framework v2](https://quasar.dev/) sobre [Vue.js 3](https://vuejs.org/).

---

## Requisitos de Ambiente

> **Atenção:** O não cumprimento das versões especificadas abaixo pode resultar em falhas de instalação, erros de build ou comportamento inesperado em produção.

| Dependência | Versão Requerida | Observação |
|---|---|---|
| **Node.js** | `^22` (LTS atual) | Versões 18 e 20 estão depreciadas nos runners do GitHub Actions a partir de setembro de 2025 |
| **npm** | `>= 6.13.4` | Utilize `npm install` — evite `npm ci` em ambientes sem `package-lock.json` atualizado |
| **yarn** | `>= 1.21.1` | Alternativa ao npm para uso local |
| **Quasar CLI** | Incluído via `@quasar/app-vite` | Não instalar globalmente; utilizar `npx quasar` |

### Justificativa da versão do Node.js

O GitHub Actions deprecou o Node.js 20 nos runners hospedados a partir de **19 de setembro de 2025**, forçando a execução em Node.js 24. Para garantir compatibilidade entre o ambiente local de desenvolvimento e o pipeline de CI/CD, adotou-se o **Node.js 22 LTS** como versão padrão do projeto.

Referência: [GitHub Blog — Deprecation of Node 20 on GitHub-hosted runners](https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-hosted-runners/)

---

## Instalação das Dependências

```bash
npm install
```

> Utilize `npm install` em vez de `npm ci`. O repositório mantém tanto `yarn.lock` quanto `package-lock.json`; o uso de `npm ci` pode resultar em erro caso os arquivos de lock estejam dessincronizados.

---

## Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com os valores correspondentes ao ambiente de execução desejado.

---

## Execução em Modo de Desenvolvimento

```bash
npx quasar dev
# ou, com Quasar CLI instalado globalmente:
quasar dev
```

---

## Build para Produção

```bash
NODE_OPTIONS=--max-old-space-size=4096 npm run build
# ou equivalentemente:
NODE_OPTIONS=--max-old-space-size=4096 npx quasar build
```

> A flag `--max-old-space-size=4096` é necessária para evitar erros de memória durante o processo de build em ambientes com recursos limitados.

---

## Lint e Formatação

```bash
# Verificação de lint
npm run lint

# Formatação automática
npm run format
```

---

## Pipeline de CI/CD

O pipeline é gerenciado pelo **GitHub Actions** e executa automaticamente a cada push na branch `main`.

### Fluxo de execução

1. **Checkout** do repositório
2. **Configuração do Node.js 22** com cache de dependências (`cache: 'npm'`)
3. **Instalação das dependências** com `npm install`
4. **Build da aplicação** com `NODE_OPTIONS=--max-old-space-size=4096 npm run build`
5. **Login no GitHub Container Registry (GHCR)**
6. **Build e push da imagem Docker** para `ghcr.io` (plataforma `linux/arm64`)
7. **Deploy na VM Oracle** via SSH (escreve o compose e inicia a stack com `docker compose up -d`)

### Secrets necessários no repositório GitHub

| Secret | Descrição |
|---|---|
| `ORACLE_HOST` | Endereço IP ou hostname da VM Oracle |
| `ORACLE_USERNAME` | Usuário SSH da VM Oracle |
| `ORACLE_SSH_KEY` | Chave privada SSH (formato PEM) |

> O secret `GITHUB_TOKEN` é provido automaticamente pelo GitHub Actions e não requer configuração manual.

### Observação sobre o aviso de Node.js depreciado

Ao executar o pipeline, pode ser exibido o seguinte aviso:

```
Node.js 20 is deprecated. The following actions target Node.js 20 but are
being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4.
```

Este aviso refere-se ao **runtime interno** das actions do GitHub, não à versão do Node.js utilizada pelo projeto. Trata-se de uma notificação da própria plataforma GitHub e **não impacta o funcionamento do pipeline**. O aviso cessará quando o GitHub atualizar internamente as actions para Node.js 24.

---

## Personalização da Configuração

Consulte a documentação oficial: [Configurando quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).