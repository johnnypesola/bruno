FROM node:14-alpine

# Create app directory inside image
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci
RUN npm build

# Bundle app source
COPY ./dist .

EXPOSE 8080

CMD [ "node", "./backend/Api.js" ]

