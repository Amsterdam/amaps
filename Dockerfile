FROM nginx:1.25.4-alpine3.18
LABEL maintainer="datapunt@amsterdam.nl"

ENV DEFAULT_TZ=Europe/Amsterdam

RUN apk add -U tzdata \
  && cp /usr/share/zoneinfo/${DEFAULT_TZ} /etc/localtime \
  && apk del tzdata \
  && rm -rf \
  /var/cache/apk/*

EXPOSE 8080

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY dist /usr/share/nginx/html
