const Recipe = require("../models/Recipe");
const AWS = require("aws-sdk");

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

    // Create a new recipe entry in the database
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
