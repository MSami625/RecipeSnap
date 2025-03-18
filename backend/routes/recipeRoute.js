const express = require("express");
const Router = express.Router();

const RecipeController = require("../controllers/RecipeController");
const authenticate = require("../middlewares/authenticate");
const multer = require("multer");

const upload = multer();

Router.get("/recipes/all", RecipeController.getAllRecipes);

// Router.post(
//   "/recipe/store",
//   authenticate,
//   upload.single("image"),
//   RecipeController.storeRecipe
// );

Router.get("/recipes/myrecipes", authenticate, RecipeController.getMyRecipes);
Router.get("/recipe/:id", authenticate, RecipeController.getRecipe);
Router.delete("/recipe/:id", authenticate, RecipeController.deleteRecipe);
Router.put("/recipe/:id", authenticate, RecipeController.updateRecipe);
Router.get("/recipes/search", RecipeController.searchRecipe);
Router.get("/recipes/filter", RecipeController.filterRecipe);

Router.post(
  "/recipe/:id/favorite",
  authenticate,
  RecipeController.favoriteRecipe
);

Router.get("/recipes/favorites", authenticate, RecipeController.getFavorites);

Router.get("/authors", authenticate, RecipeController.getAllUsers);

Router.get(
  "/authors/:authorId",
  authenticate,
  RecipeController.getAuthorDetails
);

Router.post(
  "/authors/:authorId/follow",
  authenticate,
  RecipeController.followAuthor
);

Router.get(
  "/recipes/followed",
  authenticate,
  RecipeController.getFollowedRecipes
);

Router.get("/user", authenticate, RecipeController.getUser);

Router.put("/user", authenticate, RecipeController.updateUser);

Router.delete("/user/:userId", authenticate, RecipeController.deleteUser);

module.exports = Router;
