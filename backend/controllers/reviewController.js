const Review = require("../models/Review");
const Recipe = require("../models/Recipe");
const User = require("../models/User");
const { text } = require("express");

exports.getReviews = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "Recipe id is required" });
    }

    const reviews = await Review.findAll({ where: { recipeId: id } });

    if (!reviews) {
      return res.status(404).json({ message: "No reviews found" });
    }

    res.status(200).json({
      status: "success",
      data: reviews,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.reviewRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const rating = req.body.rating;
    const userId = req.user.id;
    const review = req.body.review;

    if (!recipeId || !rating || !review) {
      return res
        .status(400)
        .json({ message: "Recipe id and review are required" });
    }

    const recipe = await Recipe.findOne({ where: { id: recipeId } });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const previousReview = await Review.findAll({
      where: {
        recipeId: recipeId,
      },
    });

    const averageRating =
      (previousReview.reduce((acc, review) => acc + review.rating, 0) +
        rating) /
      (previousReview.length + 1);

    const newReview = await Review.create({
      userId,
      recipeId,
      rating,
      text: review,
      reviewerName: req.user.name,
    });

    const updatedRecipe = await Recipe.update(
      { rating: averageRating },
      { where: { id: recipeId } }
    );

    if (!updatedRecipe) {
      return res.status(500).json({
        status: "fail",
        message: "Failed to rate the recipe",
      });
    }

    res.status(201).json({
      status: "success",
      data: newReview,
      message: "Recipe rated successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
