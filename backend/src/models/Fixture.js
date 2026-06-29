const mongoose = require("mongoose");

const fixtureSchema = new mongoose.Schema(
  {
    sport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sport",
      required: true,
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },

    title: {
      type: String,
      required: [true, "Fixture title is required"],
      trim: true,
    },

    opponent: {
      type: String,
      required: [true, "Opponent is required"],
      trim: true,
    },

    venue: {
      type: String,
      trim: true,
    },

    matchDate: {
      type: Date,
      required: true,
    },

    matchType: {
      type: String,
      enum: ["FRIENDLY", "TOURNAMENT", "BIG_MATCH", "ANNUAL_ENCOUNTER", "OTHER"],
      default: "OTHER",
    },

    status: {
      type: String,
      enum: ["UPCOMING", "LIVE", "COMPLETED", "CANCELLED", "POSTPONED"],
      default: "UPCOMING",
    },

    result: {
      anandaScore: String,
      opponentScore: String,
      resultText: String,
      summary: String,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Fixture", fixtureSchema);