FROM node:14-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN sed -i "s/mongodb:\/\/localhost/mongodb:\/\/mongo/g" common/services/mongoose.service.js

EXPOSE 3600

CMD ["npm", "run", "start"]
