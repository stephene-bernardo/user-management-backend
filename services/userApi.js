module.exports = class UserApi {
  constructor(userDb){
    this.userDb = userDb;
  }

  findAll (){
    return this.userDb.findAll();
  }

  insert(firstName, lastName, userName) {
    return this.userDb.create({firstName, lastName, userName})
  }

  update(id, newValues){
    Object.keys(newValues).forEach(key => newValues[key] === undefined && delete newValues[key])
    console.log(newValues)
    return this.userDb.update({ ...newValues }, {where: {id}})
  }

  get(id){
    return this.userDb.findAll({where: {id}})
  }

  delete(id){
    return this.userDb.destroy({where: {id}})
  }
};