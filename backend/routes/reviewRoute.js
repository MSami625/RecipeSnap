const express = require("express");

const Router = express.Router();
const ReviewController = require("../controllers/reviewController");
const authenticate = require("../middlewares/authenticate");

Router.get("/reviews/:id", authenticate, ReviewController.getReviews);
Router.post("/recipe/:id/review", authenticate, ReviewController.reviewRecipe);

module.exports = Router;
