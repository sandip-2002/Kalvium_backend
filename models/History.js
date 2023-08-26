const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    ans: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("History", historySchema);
