FROM node:20-alpine

WORKDIR /app/backend

# Copiar package files
COPY package*.json ./

# Instalar dependencias en producción
RUN npm ci --omit=dev

# Copiar código fuente
COPY src/ ./src/

# Puerto donde escucha Express
EXPOSE 5000

# Comando de inicio
CMD ["node", "src/index.js"]