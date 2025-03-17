const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Login Page
router.get("/login", (req, res) => {
  res.render("index");
});

// Handle Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });

  if (!user) {
    return res.status(401).send("Invalid credentials");
  }

  // Set session and cookie
  req.session.userId = user._id;
  res.cookie("userId", user._id, { maxAge: 24 * 60 * 60 * 1000 });

  res.redirect("/pres/about"); // Redirect to prescriptions page
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("userId");
  res.redirect("/auth/login");
});

module.exports = router;
