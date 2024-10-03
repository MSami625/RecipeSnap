const Sequelize = require("sequelize");
const mysql2 = require("mysql2");

const sequelize = new Sequelize(process.env.DB_CONNECTION, {
  dialect: "mysql",
  dialectModule: mysql2,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

module.exports = sequelize;
