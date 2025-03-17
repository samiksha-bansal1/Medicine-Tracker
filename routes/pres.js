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

router.get("/add", isAuthenticated, async (req, res) => {
  res.render("add");
});

// Add Prescription
router.post("/add", isAuthenticated, async (req, res) => {
  const { medicine, time, days } = req.body;
  const userId = req.session.userId || req.cookies.userId;
  const fullTime = new Date();
  const [hours, minutes] = time.split(":");
  fullTime.setHours(hours, minutes, 0, 0);

  const prescription = new Prescription({
    userId,
    medicineName: medicine,
    time: fullTime,
    days,
  });

  await prescription.save();
  res.redirect("/pres/about"); // Redirecting to /pres/about after adding prescription
});

// Auto-Delete Expired Prescriptions
router.use(async (req, res, next) => {
  await Prescription.deleteMany({ days: { $lte: 0 } });
  next();
});

router.get("/edit/:id", async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).send("Prescription not found");
    }
    res.render("editPrescription", { prescription });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.post("/edit/:id", isAuthenticated, async (req, res) => {
  try {
    const { medicine, time, days } = req.body;
    const fullTime = new Date();
    const [hours, minutes] = time.split(":");
    fullTime.setHours(hours, minutes, 0, 0);

    await Prescription.findByIdAndUpdate(req.params.id, {
      medicineName: medicine,
      time: fullTime,
      days,
    });
    res.redirect("/pres/about");
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Delete Prescription
router.post("/delete/:id", isAuthenticated, async (req, res) => {
  try {
    await Prescription.findByIdAndDelete(req.params.id);
    res.redirect("/pres/about");
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
