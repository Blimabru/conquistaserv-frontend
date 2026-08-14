# ==============================================================================
# ESTÁGIO 1: Build (Construção da Aplicação)
# ==============================================================================
# Força a execução nativa em amd64 para que a compilação pesada não passe pelo emulador ARM64 (QEMU) que causa crashes constantes.
FROM --platform=linux/amd64 node:20 AS build-stage

# Define o diretório de trabalho onde o código ficará dentro do container
WORKDIR /app

# Copia os arquivos de dependência primeiro (isso ajuda no cache do Docker, deixando builds futuros mais rápidos)
COPY package*.json ./

# Instala todas as dependências do frontend
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Garante a existência do arquivo .env para que o dotenv não cause falha (undefined) no quasar.config.js
RUN cp .env.example .env

# Compila o projeto Quasar com alocação extra de memória para evitar Heap Out of Memory do Vite
RUN NODE_OPTIONS=--max-old-space-size=4096 npm run build


# ==============================================================================
# ESTÁGIO 2: Servidor Web (Nginx)
# ==============================================================================
# Utiliza um servidor web super leve para servir os arquivos estáticos gerados no estágio anterior
FROM nginx:alpine AS production-stage

# Copia a pasta 'dist/spa' (resultado do build da Etapa 1) para a pasta pública do Nginx
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html

# Copia a configuração personalizada do Nginx para garantir que as rotas (URLs) funcionem corretamente
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Informa ao Docker que o Nginx escutará na porta 80 do container
EXPOSE 80

# Inicia o servidor Nginx e o mantém rodando em primeiro plano
CMD ["nginx", "-g", "daemon off;"]
