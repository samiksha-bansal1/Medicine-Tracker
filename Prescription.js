const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicineName: { type: String, required: true },
  time: { type: Date, required: true },
  days: { type: Number, required: true }
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);

module.exports = Prescription;
