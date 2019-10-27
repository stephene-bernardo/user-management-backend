FROM node:10-jessie
ENV HOST 0.0.0.0
WORKDIR /backend
COPY ./package.json .
RUN npm install
COPY . .
CMD ["node", "app"]