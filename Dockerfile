FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./

RUN npm install

COPY app /app/src

FROM base AS build
WORKDIR /app
COPY app ./app
COPY vite.config.* ./
COPY tsconfig.json ./
#RUN echo "BEFOREBUILD" && ls -la /app && ls -la /app/public && ls -la /app/dist

RUN npm run build



FROM nginx:stable-alpine AS production


EXPOSE 8080
COPY --from=build /app/app/dist/. /usr/share/nginx/html/
