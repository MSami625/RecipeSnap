const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/user/signup", authController.signUp);
router.post("/user/signin", authController.signIn);

module.exports = router;
