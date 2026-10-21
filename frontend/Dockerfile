# ==========================================
# Stage 1: Build de la aplicación React (Vite)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar configuración e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el código fuente
COPY . .

# Inyectar variable de entorno en tiempo de compilación para Vite
ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=$VITE_API_URL

# Compilar la aplicación estática
RUN npm run build

# ==========================================
# Stage 2: Servidor ligero Nginx en Producción
# ==========================================
FROM nginx:alpine AS production

# Copiamos la configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los estáticos compilados desde la fase builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Healthcheck interno del contenedor
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:80/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]