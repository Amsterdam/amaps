FROM node:10.10 AS build-nlmaps
LABEL maintainer="datapunt@amsterdam.nl"

WORKDIR /app
COPY package.json package.json
RUN npm install shx
COPY scripts /app/scripts
COPY config /app/config
RUN npm run nlmaps

FROM node:10.10 AS build-deps
LABEL maintainer="datapunt@amsterdam.nl"
WORKDIR /app
COPY --from=build-nlmaps /app/nlmaps /app/nlmaps
COPY scripts /app/scripts
# fix the jesse apt-get errors by skipping the download.
RUN cat /app/scripts/apt.sources.list > /etc/apt/sources.list
# Fix to 
RUN apt-get update
RUN apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 46925553
RUN apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 65FFB764
RUN apt-get install --force-yes -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
COPY package.json package.json
RUN npm install
COPY test /app/test
COPY src /app/src
COPY .eslintrc.js /app/.eslintrc.js
COPY .eslintignore /app/.eslintignore
COPY rollup.index.js /app/rollup.index.js
COPY rollup.pointquery.js /app/rollup.pointquery.js
COPY rollup.multiselect.js /app/rollup.multiselect.js
#build amaps library which is used by test.html
RUN npm run build-amaps


# Web server image
FROM nginx:1.25-alpine3.18

EXPOSE 8080

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-deps /app/test /usr/share/nginx/html
