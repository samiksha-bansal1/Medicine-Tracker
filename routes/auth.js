const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { handleUserSignup, handleUserLogin } = require("../controllers/user");
const bcrypt = require("bcrypt");

// Login Page
router.get("/login", (req, res) => {
  res.render("index");
});

// Handle Login
router.post("/login", handleUserLogin);

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("userId");
  res.redirect("/auth/login");
});

router.post("/register", handleUserSignup);

module.exports = router;
