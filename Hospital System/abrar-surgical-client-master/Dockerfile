FROM node
WORKDIR /usr/src/app
COPY package.json .
RUN npm install -g @angular/cli
RUN npm cache clean --force && npm install
RUN npm install --save-dev  --unsafe-perm node-sass
COPY . .
CMD ng serve --host 0.0.0.0 --port 4200 --poll=2000
EXPOSE 4200