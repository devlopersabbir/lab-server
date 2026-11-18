FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p uploads

LABEL org.opencontainers.image.source="https://github.com/devlopersabbir/lab-server"

EXPOSE 5000
CMD ["npm", "start"]