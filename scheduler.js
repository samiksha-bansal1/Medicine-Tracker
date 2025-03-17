const cron = require("node-cron");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Prescription = require("./models/Prescription.js");
const User = require("./models/user.js");
const { sendSMS } = require("./services/smsService"); // ✅ Import SMS service

dotenv.config();

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/medicineApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

cron.schedule("* * * * *", async () => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // Format: HH:MM

  try {
    const prescriptions = await Prescription.find({ time: currentTime });

    for (let p of prescriptions) {
      const user = await User.findById(p.userId);
      if (!user) continue;

      const message = `Reminder: Take ${p.medicineName} (${p.stock} left). Reply 'YES' if taken.`;
      await sendSMS(user.phone, message);

      console.log(`Sent reminder to ${user.phone} for ${p.medicineName}`);
    }
  } catch (error) {
    console.error("Scheduler error:", error);
  }
});

console.log("Scheduler running...");
