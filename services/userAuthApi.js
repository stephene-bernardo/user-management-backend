module.exports = class UserAuthApi {
  constructor(userAuthDb){
    this.userAuthDb = userAuthDb;
  }

  findAll (){
    return this.userAuthDb.findAll();
  }

  insert(userId, password) {
    return this.userAuthDb.create({userId, password})
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