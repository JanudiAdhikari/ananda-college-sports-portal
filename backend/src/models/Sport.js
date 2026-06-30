const mongoose = require("mongoose");

const sportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Sport name is required"],
      trim: true,
      unique: true,
    },

    slug: {
      type: String,
      required: [true, "Sport slug is required"],
      trim: true,
      lowercase: true,
      unique: true,
    },

    category: {
      type: String,
      enum: ["TEAM", "INDIVIDUAL", "AQUATIC", "ATHLETICS", "OTHER"],
      default: "TEAM",
    },

    description: {
      type: String,
      trim: true,
    },

    coverImage: {
      url: String,
      publicId: String,
    },

    achievements: [
      {
        title: String,
        year: Number,
        description: String,
      },
    ],

    displayOrder: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Sport", sportSchema);