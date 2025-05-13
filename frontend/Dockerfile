FROM node:22.13.1-slim

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm i

COPY . .

RUN rm -rf .next

RUN npm run build

CMD ["npm", "run", "start"]

