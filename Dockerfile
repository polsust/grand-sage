FROM node:24.10 AS BASE

RUN apt update && apt install -y ffmpeg

RUN npm install -g pnpm

WORKDIR /app

# /
COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm install

COPY . .
