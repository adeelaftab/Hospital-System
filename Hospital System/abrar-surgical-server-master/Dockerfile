FROM node
WORKDIR /usr/src/app
COPY package.json .
RUN npm cache clean --force && npm install
RUN npm install -g nodemon
COPY . .
CMD nodemon
EXPOSE 3000