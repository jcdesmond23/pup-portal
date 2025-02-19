FROM node:18-alpine  

RUN apk update

RUN npm install -g http-server

WORKDIR /app

COPY package.json . 
COPY package-lock.json .

RUN npm install  

COPY . .

RUN npm run build

RUN adduser -D -u 1001 apprunner && \
    chown -R apprunner /app

USER 1001

CMD ["http-server", "/app/dist"]