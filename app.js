const express = require('express')
const app = express()
const port = 4201
const Sequelize = require('sequelize');
const InitDb = require('./initdb')
const UserModel = require('./userModel')
const UserAuthModel = require('./userAuthModel')
const bodyParser     =         require("body-parser");
var { buildSchema } = require('graphql');
var graphqlHTTP = require('express-graphql');
const UserGraphQl = require('./userGraphql')
var cors = require('cors')
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
const UserAuthApi = require('./services/userAuthApi')
const UserApi = require('./services/userApi')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

const sequelize = new Sequelize('postgres', 'postgres', 'mysecretpassword', {
  port: 5433,
  dialect:'postgres'
});
const User = sequelize.define('user', UserModel, {});
const UserAuth = sequelize.define('userauth', UserAuthModel, {});
const userGraphQl = new UserGraphQl(User);
const userAuthApi = new UserAuthApi(UserAuth);
const userApi = new UserApi(User);

passport.use(new Strategy(
  async function(username, password, cb) {
    console.log("hi")
    let users = await userApi.findAll();
    let user = users.find(user => user.userName === username);

    if(!user){
      return cb(null, false);
    }
    let userAuth = await userAuthApi.get(user.id);
    if(!userAuth){
      return cb(null, false);
    }
    if(userAuth.password !== password){
      return cb(null, false);
    }
    console.log('asdasdas')

    return cb(null, user);

  }));


passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  userAuthApi.get(userId).then((user, err)=>{
    if (err) { return cb(err); }
    cb(null, user);
  });
});
InitDb(sequelize).then(() => {
  userApi.insert('karl', 'bernardo', 'lrak')
  userAuthApi.insert(1, 'somepassword')

  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/login',
    function(req, res){
      res.send('login');
    });

  app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    });

  // app.post('/login',
  //   passport.authenticate('local', { failureRedirect: '/login' }),
  //   function(req, res) {
  //     console.log('asdfas')
  //     res.redirect('/');
  //   });

  var schema = buildSchema(userGraphQl.getBuildSchema());
  app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: userGraphQl.getResolver(),
    graphiql: true,
  }));

  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
});

