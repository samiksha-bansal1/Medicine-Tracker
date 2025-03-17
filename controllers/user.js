const User = require("../models/User");
const bcrypt = require("bcrypt");

async function handleUserSignup(req, res) {
  try {
    const { name, age, gender, phone, email, password } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res
        .status(400)
        .send("User with this phone number already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      age,
      gender,
      phone,
      email,
      password: hashedPassword,
    });

    return res.redirect("/auth/login");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error signing up");
  }
}

async function handleUserLogin(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid credentials");
    }

    req.session.userId = user._id;
    res.cookie("userId", user._id.toString(), {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
    });

    res.redirect("/pres/about");
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).send("Server Error");
  }
}

module.exports = { handleUserSignup, handleUserLogin };
