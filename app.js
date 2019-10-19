const express = require('express')
const app = express()
const port = 4201
const Sequelize = require('sequelize');
const InitDb = require('./initdb')
const UserModel = require('./userModel')
const bodyParser     =         require("body-parser");
var { buildSchema } = require('graphql');
var graphqlHTTP = require('express-graphql');
const UserGraphQl = require('./userGraphql')
var cors = require('cors')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const sequelize = new Sequelize('postgres', 'postgres', 'mysecretpassword', {
  port: 5433,
  dialect:'postgres'
});
const User = sequelize.define('user', UserModel, {});
const userGraphQl = new UserGraphQl(User)
InitDb(sequelize).then(() => {
  var schema = buildSchema(userGraphQl.getBuildSchema());

  app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: userGraphQl.getResolver(),
    graphiql: true,
  }));

  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
});

