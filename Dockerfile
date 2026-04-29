FROM node:23-alpine

WORKDIR /usr/src/app

RUN corepack enable

COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm install

COPY . .