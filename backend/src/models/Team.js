const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    sport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sport",
      required: true,
    },

    name: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
    },

    ageGroup: {
      type: String,
      required: [true, "Age group is required"],
      enum: [
        "UNDER_12",
        "UNDER_14",
        "UNDER_16",
        "UNDER_18",
        "UNDER_20",
        "FIRST_TEAM",
        "SENIOR",
        "OPEN",
      ],
    },

    year: {
      type: Number,
      required: true,
    },

    coachName: {
      type: String,
      trim: true,
    },

    assistantCoachName: {
      type: String,
      trim: true,
    },

    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },

    viceCaptain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },

    teamPhoto: {
      url: String,
      publicId: String,
    },

    summary: {
      type: String,
      trim: true,
    },

    achievements: [
      {
        title: String,
        year: Number,
        description: String,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Team", teamSchema);