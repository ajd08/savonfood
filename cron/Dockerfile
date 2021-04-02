FROM node:alpine

WORKDIR /src/app

COPY ./ /src/app

# copy crontabs for root user
COPY cronjobs /etc/crontabs/root


RUN npm update -g
RUN npm install -g ts-node
RUN npm install

RUN apk update
RUN apk upgrade
RUN apk add bash
RUN echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk add --no-cache \
      chromium@edge \
      nss@edge

# start crond with log level 8 in foreground, output to stderr

CMD ["crond", "-f", "-d", "8"]
