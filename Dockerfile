# Estágio 1: Build da aplicação Vite
FROM node:20-alpine AS builder

WORKDIR /app

# Copia arquivos de dependências
COPY package.json package-lock.json ./

# Instala dependências
RUN npm ci

# Copia todo o código fonte
COPY . .

# Gera o build de produção (gera a pasta dist/)
RUN npm run build

# Estágio 2: Servidor Web Nginx ultra-leve
FROM nginx:alpine

# Remove arquivos padrões do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia o build gerado no estágio anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia a configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Informa ao Coolify a porta interna da aplicação
EXPOSE 80

# Inicia o Nginx em primeiro plano
CMD ["nginx", "-g", "daemon off;"]
