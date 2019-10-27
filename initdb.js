module.exports = async function InitDb(sequelize){
  try{
    await sequelize.authenticate()
    console.log('Connection has been established successfully.');
    return sequelize.sync({ force: true })
  } catch (e) {
      console.error('Unable to connect to the database:', e);
      throw e;
  }
};
