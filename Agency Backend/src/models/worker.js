const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    isWorked: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const worker = mongoose.model("worker", workerSchema);

module.exports = worker;
