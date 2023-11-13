FROM node:16.13-buster-slim as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG VITE_API_GATEWAY

ENV VITE_API_GATEWAY=$VITE_API_GATEWAY

RUN printenv | sed -E 's/(.*)(=)/\1\2/g' > .env
RUN npm run build


FROM nginx:1.19.6-alpine as production-stage
WORKDIR /usr/share/nginx/html/sistema
COPY --from=build /app/dist .
COPY --from=build /app/.env .
COPY nginx.conf /etc/nginx/nginx.conf

