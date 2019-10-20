FROM node:10-jessie
WORKDIR /backend
COPY ./package.json .
RUN npm install
COPY . .
CMD ["node", "app"]