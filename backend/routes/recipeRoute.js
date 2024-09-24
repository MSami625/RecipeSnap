const express = require("express");
const Router = express.Router();

const RecipeController = require("../controllers/RecipeController");
const authenticate = require("../middlewares/authenticate");
const multer = require("multer");

const upload = multer();

Router.get("/recipe/all", authenticate, RecipeController.getAllRecipes);
Router.post(
  "/recipe/store",
  authenticate,
  upload.single("image"),
  RecipeController.storeRecipe
);
// Router.get("/recipe/:id", authenticate, RecipeController.getRecipe);

module.exports = Router;
