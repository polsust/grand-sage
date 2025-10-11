FROM node:24.10 AS BASE

RUN apt update && apt install -y ffmpeg tzdata

ENV TZ=Europe/Madrid

RUN npm install -g pnpm

WORKDIR /app

# /
COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .
