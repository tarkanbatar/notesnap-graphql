const mongoose = require("../database");
const { Schema, model } = mongoose;

const snapSchema = new Schema({
  message: { type: String, required: true, maxLength: 280 },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Snap = model("Snap", snapSchema);

module.exports = Snap;
