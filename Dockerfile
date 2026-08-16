FROM nginx:alpine

# O build pesado já foi feito nativamente no Github Actions pelo Runner.
# O Dockerfile atua apenas como empacotador para o ARM64, copiando os estáticos.
COPY dist/spa /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
