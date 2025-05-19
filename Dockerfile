FROM node:23-alpine AS base
WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./

RUN npm install

COPY app /app/src

FROM base AS build
WORKDIR /app
COPY app ./app
COPY public ./public
COPY vite.config.* ./
COPY tsconfig.json ./
#RUN echo "BEFOREBUILD" && ls -la /app && ls -la /app/public && ls -la /app/dist

RUN npm run build:all

FROM build AS test
CMD ["npm", "run", "test"]

FROM node:23-alpine AS upgrade
USER root
RUN npm install -g npm-check-updates
CMD ["ncu", "-u", "--doctor", "--target latest"]



FROM nginx:stable-alpine AS production


EXPOSE 8080
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/app/dist/. /usr/share/nginx/html/

