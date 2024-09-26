const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/user/signup", authController.signUp);
router.post("/user/signin", authController.signIn);
router.post("/admin/signin", authController.adminSignIn);

module.exports = router;
