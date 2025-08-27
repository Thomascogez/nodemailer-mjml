FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

RUN corepack enable

RUN yarn

COPY . .