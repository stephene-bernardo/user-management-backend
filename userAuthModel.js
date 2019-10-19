const Sequelize = require('sequelize');

module.exports = {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
};