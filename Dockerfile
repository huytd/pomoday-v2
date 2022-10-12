FROM node:13-alpine AS builder

RUN apk add --no-cache make python git g++ util-linux

WORKDIR /pomoday

COPY package.json .

RUN npm install

COPY . .

RUN npm run dist

FROM halverneus/static-file-server:v1.8.8

ENV PORT 8888

COPY --from=builder /pomoday/dist /web
