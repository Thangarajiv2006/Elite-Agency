const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    pic: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const category = mongoose.model("category", categorySchema);

module.exports = category;
