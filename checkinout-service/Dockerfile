FROM node:16.13-buster-slim

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start:prod"]
