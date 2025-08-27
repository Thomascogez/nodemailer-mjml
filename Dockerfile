FROM node:23-alpine

WORKDIR /usr/src/app

RUN corepack enable

COPY package.json .
COPY yarn.lock .
COPY .yarnrc.yml .

RUN yarn

COPY . .