const express = require('express')
const app = express()
const port = 4201
const Sequelize = require('sequelize');
const InitDb = require('./initdb')
const UserModel = require('./userModel')
const UserApi = require('./services/userApi')
const bodyParser     =         require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const sequelize = new Sequelize('postgres', 'postgres', 'mysecretpassword', {
  port: 5433,
  dialect:'postgres'
});
const User = sequelize.define('user', UserModel, {});
const userApi = new UserApi(User);
InitDb(sequelize).then(() => {
  app.get('/users', async (req, res) => {
    users = await userApi.findAll();
    res.send(users)
  });

  app.post('/user', async (req, res)=> {
    const {firstName, lastName, userName} = req.body;
    const user = await userApi.insert(firstName, lastName, userName);
    res.send(`Successfully create user ${user.id}`)
  });

  app.get('/user/:id', async (req, res) => {
    const id = req.params.id
    const user = await userApi.get(id)
    res.send(user)
  });

  app.patch('/user/:id', async (req, res)=> {
    const id = req.params.id
    const {firstName, lastName, userName} = req.body;
    const user = await userApi.update(id, {firstName, lastName, userName});
    res.send(`Successfully updated user ${id}`)
  });

  app.delete('/user/:id', async (req, res) => {
    const id = req.params.id
    await userApi.delete(id)
    res.send(`Successfuly remove user ${id}`)
  });

  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
});

