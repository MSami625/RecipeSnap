const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Review = sequelize.define("review", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  rating: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  text: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [1, 500],
    },
  },
  reviewerName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Review;
