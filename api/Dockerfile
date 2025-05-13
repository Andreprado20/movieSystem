# Dockerfile para API NestJS com Prisma
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY . .

# Gera Prisma Client
RUN npx prisma generate
RUN npm run build

# Expõe a porta padrão do NestJS
EXPOSE 3000

CMD ["node", "dist/main"]
