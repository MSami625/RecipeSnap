require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelise = require("./utils/database");
const authRoutes = require("./routes/authRoute");
const User = require("./models/User");
const Recipe = require("./models/Recipe");
const RecipeRoutes = require("./routes/recipeRoute");

// middlewares
const app = express();
app.use(cors());
app.use(express.json());

User.hasMany(Recipe);
Recipe.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

// routes
app.use("/api", authRoutes);
app.use("/api", RecipeRoutes);

sequelise
  // .sync((force = true))
  .sync()
  .then(() => {
    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
