FROM alpine
RUN apk --no-cache add node npm

WORKDIR /app
COPY index.js .
COPY package.json .
COPY package-lock.json .

RUN npm install

FROM alpine
RUN apk --no-cache add node npm

COPY --from=0 /app /app

WORKDIR /root/
ENTRYPOINT ["/usr/bin/node", "/app/index.js"]