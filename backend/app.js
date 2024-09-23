require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelise = require("./utils/database");
const authRoutes = require("./routes/authRoute");

// middlewares
const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/api", authRoutes);

sequelise
  .sync()
  .then(() => {
    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
