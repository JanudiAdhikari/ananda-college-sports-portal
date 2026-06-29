const mongoose = require("mongoose");

const liveMatchSchema = new mongoose.Schema(
  {
    sport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sport",
      required: true,
    },

    fixture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fixture",
    },

    title: {
      type: String,
      required: [true, "Live match title is required"],
      trim: true,
    },

    anandaTeamName: {
      type: String,
      default: "Ananda College",
      trim: true,
    },

    opponentTeamName: {
      type: String,
      required: [true, "Opponent team name is required"],
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

    videoUrl: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["SCHEDULED", "LIVE", "COMPLETED", "CANCELLED"],
      default: "SCHEDULED",
    },

    score: {
      anandaScore: {
        type: String,
        default: "",
      },
      opponentScore: {
        type: String,
        default: "",
      },
      currentStatus: {
        type: String,
        default: "",
      },
      overs: {
        type: String,
        default: "",
      },
      wickets: {
        type: String,
        default: "",
      },
    },

    updates: [
      {
        time: String,
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LiveMatch", liveMatchSchema);