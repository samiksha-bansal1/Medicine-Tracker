const express = require("express");
const Prescription = require("../models/Prescription");
const User = require("../models/User");

const router = express.Router();

router.post("/sms-response", async (req, res) => {
    try {
        const { phone, message } = req.body;

        if (message.toUpperCase() === "YES") {
            const user = await User.findOne({ phone });
            if (!user) return res.status(404).json({ error: "User not found" });

            const prescription = await Prescription.findOne({ userId: user._id, time: new Date().toTimeString().slice(0, 5) });
            if (!prescription) return res.status(404).json({ error: "No matching prescription" });

            // Reduce stock
            prescription.stock -= 1;
            await prescription.save();

            console.log(`Medicine taken: ${prescription.medicineName} (Stock: ${prescription.stock})`);
            return res.json({ success: true, message: "Stock updated" });
        }

        res.json({ success: false, message: "Invalid response" });
    } catch (error) {
        console.error("Error handling SMS response:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
