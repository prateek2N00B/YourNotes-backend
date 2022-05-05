FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm audit fix --force
COPY . .

EXPOSE 5000
CMD [ "node", "server.js" ]