const bcrypt = require('bcrypt');

module.exports = class UserAuthApi {
  constructor(userAuthDb){
    this.userAuthDb = userAuthDb;
  }

  findAll (){
    return this.userAuthDb.findAll();
  }

  insert(userId, password) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    return this.userAuthDb.create({userId, password: hash})
  }

  update(userId, newValues){
    Object.keys(newValues).forEach(key => newValues[key] === undefined && delete newValues[key])
    console.log(newValues)
    return this.userAuthDb.update({ ...newValues }, {where: {userId}})
  }

  get(userId){
    return this.userAuthDb.findAll({where: {userId}})
  }

  delete(userId){
    return this.userAuthDb.destroy({where: {userId}})
  }
};