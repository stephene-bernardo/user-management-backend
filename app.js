const express = require('express');
const app = express();
const port = 3001;
const Sequelize = require('sequelize');
const InitDb = require('./initdb');
const UserModel = require('./userModel');
const UserAuthModel = require('./userAuthModel');
const bodyParser     =         require("body-parser");
var { buildSchema } = require('graphql');
var graphqlHTTP = require('express-graphql');
const UserGraphQl = require('./userGraphql');
var cors = require('cors');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
const UserAuthApi = require('./services/userAuthApi');
const UserApi = require('./services/userApi');
const authMiddleware = require('./middlewareAuth');
const bcrypt = require('bcrypt');

const HOST= process.env.HOST || 'localhost';
const POSTGRES_PORT = process.env.POSTGRES_PORT || 5432;
const POSTGRES_DB = process.env.POSTGRES_DB || 'postgres';
const POSTGRES_USER = process.env.POSTGRES_USER || 'postgres';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'mysecretpassword';
const POSTGRES_HOST = process.env.POSTGRES_HOST || 'localhost';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

const sequelize = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, {
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  dialect:'postgres'
});
const User = sequelize.define('user', UserModel, {});
const UserAuth = sequelize.define('userauth', UserAuthModel, {});
const userGraphQl = new UserGraphQl(User, UserAuth);
const userAuthApi = new UserAuthApi(UserAuth);
const userApi = new UserApi(User);

passport.use(new Strategy(
  async function(username, password, cb) {
    let users = await userApi.findAll();
    let user = users.find(user => user.userName === username);

    if(!user){
      return cb(null, false);
    }
    let [userAuth] = await userAuthApi.get(user.id);
    if(!userAuth){
      return cb(null, false);
    }
    if(!bcrypt.compareSync(password, userAuth.password)){
      return cb(null, false);
    }
    return cb(null, user);

  }));


passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(user, cb) {
  cb(null, user);
});
InitDb(sequelize).then(() => {
  userApi.insert('Admin', 'Instar', 'admin')
  userAuthApi.insert(1, 'admin')

  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/login',  function(req, res){
      res.send('login');
    });

  app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
      console.log(req.session)
      res.send(req.session);
    });

  var schema = buildSchema(userGraphQl.getBuildSchema());
  app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: userGraphQl.getResolver(),
    graphiql: false,
  }));

  app.get('/profile',  authMiddleware.loginRequired,
    function(req, res){
      res.send(req.session);
    });

  app.post('/register', function(req, res, next) {
    console.log('hiiii')
    console.log(req.body);
    userApi.insert(req.body.firstname, req.body.lastname, req.body.username).then(async result => {
      await userAuthApi.insert(result.id, req.body.password);
      next()
    })
  }, passport.authenticate('local', { failureRedirect: '/login' }), 
  function(req, res) {
    res.send("registration completed");
  });

  app.patch('/change-password', async function(req, res) {
    let users = await userApi.findAll()
    let user = await users.find(user => user.userName === req.body.username)
    let abc= await userAuthApi.delete(user.id)
    let userAuth = await userAuthApi.insert(user.id, req.body.password);
    res.send("Successfuly Change password");
  });

  app.get('/logout', (req, res) => {
      req.session.destroy();
      res.send('logout')
  })

  app.listen(port, HOST , () => console.log(`Example app listening on port ${HOST}:${port}!`))
});