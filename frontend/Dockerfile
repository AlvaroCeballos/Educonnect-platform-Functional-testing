FROM node:20-alpine as builder

WORKDIR /app/frontend

# Copiar package files
COPY package*.json ./

# Instalar dependencias (incluye dev para build)
RUN npm ci

# Copiar código fuente y configuración
COPY src/ ./src/
COPY public/ ./public/
COPY index.html vite.config.js ./

# Build de producción
RUN npm run build

# Stage final: servir con serve
FROM node:20-alpine

WORKDIR /app/frontend

# Instalar servidor HTTP simple
RUN npm install -g serve

# Copiar assets construido desde builder
COPY --from=builder /app/frontend/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]