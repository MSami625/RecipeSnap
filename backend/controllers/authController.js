const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }

    const doesUserExist = await User.findOne({
      where: {
        email,
      },
    });

    if (doesUserExist) {
      return res.status(400).json({
        status: "fail",
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    if (!hashedPassword) {
      return res.status(400).json({
        status: "fail",
        message: "Failed to hash password",
      });
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Failed to create user",
      });
    }

    return res.status(201).json({
      status: "success",
      message: "User created successfully",
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide both Email and Password",
      });
    }

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "User does not exist",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: "fail",
        message: "Wrong Password",
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      status: "success",
      message: "Sign in successful",
      token,
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.adminSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide both Email and Password",
      });
    }

    if (email != process.env.ADMIN_EMAIL) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid Email",
      });
    }

    if (password != process.env.ADMIN_PASSWORD) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid Password",
      });
    }

    const isAdmin = "admin";
    const userId = 4;

    const token = jwt.sign({ email, isAdmin, userId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      status: "success",
      message: "Sign in successful",
      token,
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
