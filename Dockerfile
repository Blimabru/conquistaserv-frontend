FROM nginx:alpine

# O build pesado já foi feito nativamente no Github Actions pelo Runner.
# O Dockerfile atua apenas como empacotador para o ARM64, copiando os estáticos.
COPY dist/spa /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
