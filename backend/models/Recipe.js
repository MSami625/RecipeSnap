const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Recipe = sequelize.define("recipe", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ingredients: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  method: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  cuisine: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mainIngredient: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  recipeType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cookingTime: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  preparationTime: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  marinationTime: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  soakingTime: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  serves: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  otherNames: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tags: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  keywords: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  source: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING, // URL s3 bucket
    allowNull: false,
  },
  ownerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = Recipe;
