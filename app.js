const express = require('express')
const app = express()
const port = 4201
const Sequelize = require('sequelize');
const InitDb = require('./initdb')
const UserModel = require('./userModel')

const sequelize = new Sequelize('postgres', 'postgres', 'mysecretpassword', {
  port: 5433,
  dialect:'postgres'
});
const User = sequelize.define('user', UserModel, {});
InitDb(sequelize).then(() => {
  app.get('/', async (req, res) => {
    await User.create({
      firstName:'Karl',
      lastName: 'Bernardo',
      userName:'lrak'
    }).then(()=>{
        console.log('asdas')
    })

    // await User.findAll().then(users => {
    //   console.log("All users:", JSON.stringify(users, null, 4));
    // });
    res.send('Hello World!')
  });

  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
});

