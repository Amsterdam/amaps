FROM node:23-alpine AS base
WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./

ARG AMSTERDAM_API_KEY
ENV AMSTERDAM_API_KEY=$AMSTERDAM_API_KEY

RUN npm install

COPY app /app/src

FROM base AS build
WORKDIR /app
COPY app ./app
COPY public ./public
COPY vite.config.* ./
COPY tsconfig.json ./

RUN npm run build

FROM build AS test
CMD ["npm", "run", "test"]

FROM node:23-alpine AS upgrade
USER root
RUN npm install -g npm-check-updates
CMD ["ncu", "-u", "--doctor", "--target latest"]



FROM nginx:stable-alpine AS production

EXPOSE 8080
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Build output copied to a writable directory
COPY --from=build /app/app/dist/. /var/www/html/

# Copy runtime env script
WORKDIR /app
COPY env.sh env.sh

RUN apk add --no-cache bash
RUN chmod +x env.sh

# Make /var/www/html writable so env.sh can inject env variable
RUN chmod -R 777 /var/www/html

CMD ["/bin/bash", "-c", "\
    /app/env.sh && \
    chmod -R a-w /var/www/html && \
    nginx -g 'daemon off;' \
"]
