const Recipe = require("../models/Recipe");
const AWS = require("aws-sdk");
const Review = require("../models/Review");
const { Op, where } = require("sequelize");
const sequelize = require("../utils/database");
const User = require("../models/User");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      order: [["rating", "DESC"]],
    });

    if (recipes.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No recipes found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: recipes,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.storeRecipe = async (req, res) => {
  try {
    const user = req.user;
    console.log(req.body);

    const compulsoryFields = [
      "name",
      "ingredients",
      "method",
      "cuisine",
      "mainIngredient",
      "recipeType",
    ];

    const missingFields = compulsoryFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: "fail",
        message: `Missing compulsory fields: ${missingFields.join(", ")}`,
      });
    }

    let imageUrl;

    if (req.file) {
      const { originalname, buffer } = req.file;

      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `recipeImages/${Date.now()}_${originalname}`,
        Body: buffer,
        ACL: "public-read",
        ContentType: req.file.mimetype,
      };

      // Upload the image to S3
      const s3Response = await s3.upload(params).promise();
      imageUrl = s3Response.Location;
    }

    const newRecipe = await Recipe.create({
      name: req.body.name,
      description: req.body.description || "",
      ingredients: req.body.ingredients,
      method: req.body.method,
      cuisine: req.body.cuisine,
      mainIngredient: req.body.mainIngredient,
      recipeType: req.body.recipeType,
      cookingTime: req.body.cookingTime || "",
      preparationTime: req.body.preparationTime || "",
      marinationTime: req.body.marinationTime || "",
      soakingTime: req.body.soakingTime || "",
      serves: req.body.serves || "",
      otherNames: req.body.otherNames || "",
      tags: req.body.tags || "",
      keywords: req.body.keywords || "",
      source: req.body.source || "",
      notes: req.body.notes || "",
      image: imageUrl || null,
      userId: user.id,
      ownerName: user.name,
    });

    res.status(201).json({
      status: "success",
      message: "Recipe created successfully",
      data: newRecipe,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.getMyRecipes = async (req, res) => {
  try {
    const user = req.user;
    const myRecipes = await Recipe.findAll({
      where: {
        userId: user.id,
      },
    });

    if (myRecipes.length === 0) {
      return res.json({
        status: "fail",
        message: "No recipes found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: myRecipes,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.getRecipe = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        status: "fail",
        message: "Recipe ID is required",
      });
    }

    const recipe = await Recipe.findByPk(id);

    if (!recipe) {
      return res.status(404).json({
        status: "fail",
        message: "Recipe not found",
      });
    }

    const reviews = await Review.findAll({
      where: {
        recipeId: id,
      },
    });

    const responseData = {
      recipe,
      reviews,
    };

    return res.status(200).json({
      status: "success",
      data: responseData,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        status: "fail",
        message: "Recipe ID is required",
      });
    }

    const recipe = await Recipe.findByPk(id);

    if (!recipe) {
      return res.status(404).json({
        status: "fail",
        message: "Recipe not found",
      });
    }

    await recipe.destroy();

    return res.status(200).json({
      status: "success",
      message: "Recipe deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.user;

    if (!id) {
      return res.status(400).json({
        status: "fail",
        message: "Recipe ID is required",
      });
    }

    const recipe = await Recipe.findByPk(id);

    if (!recipe) {
      return res.status(404).json({
        status: "fail",
        message: "Recipe not found",
      });
    }

    if (recipe.userId !== user.id) {
      return res.status(403).json({
        status: "fail",
        message: "You are not authorized to update this recipe",
      });
    }

    const {
      name,
      description,
      ingredients,
      method,
      cuisine,
      mainIngredient,
      recipeType,
      cookingTime,
      preparationTime,
      marinationTime,
      soakingTime,
      serves,
      otherNames,
      tags,
      keywords,
      source,
      notes,
    } = req.body;

    const updatedValues = {};

    if (name) updatedValues.name = name;
    if (description) updatedValues.description = description;
    if (ingredients) updatedValues.ingredients = ingredients;
    if (method) updatedValues.method = method;
    if (cuisine) updatedValues.cuisine = cuisine;
    if (mainIngredient) updatedValues.mainIngredient = mainIngredient;
    if (recipeType) updatedValues.recipeType = recipeType;
    if (cookingTime) updatedValues.cookingTime = cookingTime;
    if (preparationTime) updatedValues.preparationTime = preparationTime;
    if (marinationTime) updatedValues.marinationTime = marinationTime;
    if (soakingTime) updatedValues.soakingTime = soakingTime;
    if (serves) updatedValues.serves = serves;
    if (otherNames) updatedValues.otherNames = otherNames;
    if (tags) updatedValues.tags = tags;
    if (keywords) updatedValues.keywords = keywords;
    if (source) updatedValues.source = source;
    if (notes) updatedValues.notes = notes;

    await recipe.update(updatedValues);

    return res.status(200).json({
      status: "success",
      data: {
        recipe,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.searchRecipe = async (req, res) => {
  try {
    const searchName = req.query.name;

    const recipes = await Recipe.findAll({
      where: {
        name: {
          [Op.like]: `%${searchName}%`,
        },
      },
    });

    if (recipes.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No recipes found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: recipes,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.filterRecipe = async (req, res) => {
  const { dietaryPreferences, difficulty, preparationTime } = req.query;

  let cookingTime;

  if (difficulty === "easy") {
    cookingTime = "30 mins";
  } else if (difficulty === "medium") {
    cookingTime = "1 hour";
  } else if (difficulty === "hard") {
    cookingTime = "2 hours";
  }

  try {
    const whereClause = {
      [Op.and]: [],
    };

    if (preparationTime) {
      whereClause[Op.and].push({
        preparationTime: {
          [Op.like]: `%${preparationTime}%`,
        },
      });
    }

    if (cookingTime) {
      whereClause[Op.and].push({
        cookingTime: {
          [Op.like]: `%${cookingTime}%`,
        },
      });
    }

    if (dietaryPreferences) {
      if (dietaryPreferences === "vegetarian") {
        whereClause[Op.and].push({
          [Op.not]: {
            [Op.or]: [
              { ingredients: { [Op.like]: `%chicken%` } },
              { ingredients: { [Op.like]: `%beef%` } },
              { ingredients: { [Op.like]: `%pork%` } },
              { ingredients: { [Op.like]: `%fish%` } },
              { ingredients: { [Op.like]: `%egg%` } },
              { ingredients: { [Op.like]: `%mutton%` } },
              { ingredients: { [Op.like]: `%prawn%` } },
              { ingredients: { [Op.like]: `%crab%` } },
              { ingredients: { [Op.like]: `%lobster%` } },
              { ingredients: { [Op.like]: `%duck%` } },
              { ingredients: { [Op.like]: `%turkey%` } },
              { ingredients: { [Op.like]: `%salmon%` } },
              { ingredients: { [Op.like]: `%tuna%` } },
              { ingredients: { [Op.like]: `%lamb%` } },
            ],
          },
        });
      } else if (dietaryPreferences === "non-vegetarian") {
        whereClause[Op.and].push({
          [Op.or]: [
            { ingredients: { [Op.like]: `%chicken%` } },
            { ingredients: { [Op.like]: `%beef%` } },
            { ingredients: { [Op.like]: `%pork%` } },
            { ingredients: { [Op.like]: `%fish%` } },
            { ingredients: { [Op.like]: `%egg%` } },
            { ingredients: { [Op.like]: `%mutton%` } },
            { ingredients: { [Op.like]: `%prawn%` } },
            { ingredients: { [Op.like]: `%crab%` } },
            { ingredients: { [Op.like]: `%lobster%` } },
            { ingredients: { [Op.like]: `%duck%` } },
            { ingredients: { [Op.like]: `%turkey%` } },
            { ingredients: { [Op.like]: `%salmon%` } },
            { ingredients: { [Op.like]: `%tuna%` } },
            { ingredients: { [Op.like]: `%lamb%` } },
          ],
        });
      }
    }

    const recipes = await Recipe.findAll({
      where: whereClause,
    });

    if (recipes.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No recipes found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: recipes,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.favoriteRecipe = async (req, res) => {
  try {
    const userId = req.user.id;
    const recipeId = req.params.id;

    const recipe = await Recipe.findByPk(recipeId);

    if (!recipe) {
      return res.status(404).json({
        status: "fail",
        message: "Recipe not found",
      });
    }

    const favorite = await sequelize.models.Favorite.findOne({
      where: { userId, recipeId },
    });

    if (favorite) {
      await favorite.destroy();
      return res.status(200).json({ message: "Recipe removed from favorites" });
    } else {
      await sequelize.models.Favorite.create({
        userId,
        recipeId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Added to Favorite.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await sequelize.models.Favorite.findAll({
      where: { userId },
    });

    if (favorites.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No favorites found",
      });
    }

    const favoritesId = favorites.map((f) => f.recipeId);

    const recipes = await Recipe.findAll({
      where: {
        id: {
          [Op.in]: favoritesId,
        },
      },
    });

    return res.status(200).json({
      status: "success",
      data: recipes,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        email: {
          [Op.ne]: "admin@recipesnap.com",
        },
      },
    });
    if (users.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No users found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.getAuthorDetails = async (req, res) => {
  try {
    const authorId = req.params.authorId;
    const user = req.user;

    const author = await User.findByPk(authorId);

    let isFollowing = false;

    const follow = await sequelize.models.Follow.findOne({
      where: {
        followerId: user.id,
        followingId: authorId,
      },
    });

    console.log(follow + "follow");

    isFollowing = follow ? true : false;

    if (!author) {
      return res.status(404).json({
        status: "fail",
        message: "Author not found",
      });
    }

    const recipes = await Recipe.findAll({
      where: {
        userId: authorId,
      },
    });

    const responseData = {
      author,
      recipes,
      isFollowing,
    };
    return res.status(200).json({
      status: "success",
      data: responseData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.followAuthor = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.authorId;

    console.log(followerId, followingId);

    if (followerId == followingId) {
      return res.status(400).json({
        status: "fail",
        message: "You cannot follow yourself",
      });
    }

    console.log(followerId, followingId + "follow");

    const [follow, created] = await sequelize.models.Follow.findOrCreate({
      where: { followerId, followingId },
      defaults: { createdAt: new Date(), updatedAt: new Date() },
    });

    if (!created) {
      return res.status(400).json({ message: "Already following this author" });
    }

    return res.status(200).json({ message: "Following author." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.getFollowedRecipes = async (req, res) => {
  try {
    const userId = req.user.id;

    const followed = await sequelize.models.Follow.findAll({
      where: { followerId: userId },
    });

    const followedIds = followed.map((f) => f.followingId);

    const recipes = await Recipe.findAll({
      where: {
        userId: {
          [Op.in]: followedIds,
        },
      },
    });

    if (recipes.length === 0) {
      return res.json({
        status: "fail",
        message: "No recipes found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: recipes,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = req.user;

    const { name } = req.body;

    const updatedValues = {};

    if (name) updatedValues.name = name;

    await user.update(updatedValues);

    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findByPk(userId);

    await user.destroy();

    return res.status(200).json({
      status: "success",
      message: "Account deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
