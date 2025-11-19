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

# Copy build output to Nginx
COPY --from=build /app/app/dist/. /usr/share/nginx/html/

# Copy runtime env script
WORKDIR /app
COPY env.sh env.sh

# Add bash so we can run the script
RUN apk add --no-cache bash
RUN chmod +x env.sh

# Make web root writable for injection at runtime
RUN chmod -R 777 /usr/share/nginx/html

# Start container: run env.sh, inject secrets, then make web root read-only, then start Nginx
CMD ["/bin/bash", "-c", "\
    /app/env.sh && \
    nginx -g 'daemon off;' \
"]
