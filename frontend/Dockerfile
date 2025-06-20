FROM node:18-alpine

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 5173

# Para desarrollo: permitir conexiones externas
ENV VITE_HOST=0.0.0.0

# Comando para desarrollo (Vite dev server)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"] 