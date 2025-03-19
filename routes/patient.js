const express = require("express");
const router = express.Router();
const Patient = require("../models/patient");

// Form Render Route
router.get("/form", (req, res) => {
  res.render("details");
});

// Form Submission Route
router.post("/submit", async (req, res) => {
  try {
    console.log("📥 Form Data Received:", req.body); // Debugging: Check received data

    const { name, email, phone, age, gender, condition } = req.body;

    // Check for missing fields
    if (!name || !email || !phone || !age || !gender || !condition) {
      console.error("❌ Missing Fields:", { name, email, phone, age, gender, condition });
      return res.status(400).send("❌ All fields are required!");
    }

    // New patient create
    const newPatient = new Patient({ name, email, age, gender, phone, condition });
    await newPatient.save();

    console.log("✅ Patient Saved Successfully!");

    // Redirect to summary page with success message
    res.render("summary", { 
      name, 
      email, 
      phone, 
      age, 
      gender, 
      condition, 
      message: "✔ Your details were recorded successfully!" 
    });

  } catch (error) {
    console.error("❌ Error saving patient details:", error.message);
    res.status(500).send(`Error saving patient details: ${error.message}`);
  }
});

module.exports = router;
