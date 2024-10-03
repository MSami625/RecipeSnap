require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelise = require("./utils/database");
const authRoutes = require("./routes/authRoute");
const User = require("./models/User");
const Recipe = require("./models/Recipe");
const RecipeRoutes = require("./routes/recipeRoute");
const Review = require("./models/Review");
const ReviewRoute = require("./routes/reviewRoute");

// middlewares
const app = express();
app.use(
  cors({
    origin: "https://recipe-snap-nine.vercel.app",
  })
);
app.options("*", cors());

app.use(express.json());

User.hasMany(Recipe);
Recipe.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Review);
Review.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
Recipe.hasMany(Review);
Review.belongsTo(Recipe, { constraints: true, onDelete: "CASCADE" });

User.belongsToMany(User, {
  through: "Follow",
  as: "follower",
  foreignKey: "followingId",
  otherKey: "followerId",
});

User.belongsToMany(User, {
  through: "Follow",
  as: "following",
  foreignKey: "followerId",
  otherKey: "followingId",
});

User.belongsToMany(Recipe, {
  through: "Favorite",
  as: "favorite",
  foreignKey: "userId",
  otherKey: "recipeId",
  timestamps: true,
});
Recipe.belongsToMany(User, {
  through: "Favorite",
  as: "favorite",
  foreignKey: "recipeId",
  otherKey: "userId",
  timestamps: true,
});

// routes
app.use("/api", authRoutes);
app.use("/api", RecipeRoutes);
app.use("/api", ReviewRoute);

sequelise
  // .sync({ force: true })
  .sync()
  .then(() => {
    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
