const express = require("express");
const router = express.Router();
const Prescription = require("../models/Prescription");

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (!req.session.userId && !req.cookies.userId) {
    return res.redirect("/auth/login");
  }
  next();
};

// View Prescriptions
router.get("/about", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId || req.cookies.userId;
    const prescriptions = await Prescription.find({ userId });
    res.render("about", { prescriptions });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Add Prescription
router.post("/add", isAuthenticated, async (req, res) => {
  const { medicine, time, days } = req.body;
  const userId = req.session.userId || req.cookies.userId;

  const prescription = new Prescription({
    userId,
    medicineName: medicine,
    time: new Date(time),
    days,
  });

  await prescription.save();
  res.redirect("/pres/about");  // Redirecting to /pres/about after adding prescription
});

// Auto-Delete Expired Prescriptions
router.use(async (req, res, next) => {
  await Prescription.deleteMany({ days: { $lte: 0 } });
  next();
});

module.exports = router;


