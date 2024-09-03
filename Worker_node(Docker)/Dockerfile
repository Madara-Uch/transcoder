FROM node:18-alpine as base

WORKDIR /usr/src/app

RUN apk add --no-cache ffmpeg

COPY . .

RUN npm install

CMD ["node", "convert.js"]
