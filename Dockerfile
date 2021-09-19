FROM node:lts-alpine3.13 AS TEMP

WORKDIR /searcher/

RUN apk update && apk add --no-cache npm git ca-certificates
RUN git clone https://github.com/Victoreisdavid/Searcher_bot.git .
RUN rm -rf /searcher/config.yaml

COPY config.yaml /searcher/config.yaml
COPY .env /searcher/.env

RUN npm install .


FROM node:lts-alpine3.13 AS RUNNER


WORKDIR /searcher/

COPY --from=TEMP /searcher/ /searcher/

CMD ["node", "index.js"]

VOLUME ["/searcher/"]
