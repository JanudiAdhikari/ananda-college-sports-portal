const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    sport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sport",
      required: true,
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    fullName: {
      type: String,
      required: [true, "Player name is required"],
      trim: true,
    },

    admissionNumber: {
      type: String,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
    },

    ageGroup: {
      type: String,
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

    jerseyNumber: {
      type: Number,
    },

    role: {
      type: String,
      trim: true,
    },

    position: {
      type: String,
      trim: true,
    },

    battingStyle: {
      type: String,
      trim: true,
    },

    bowlingStyle: {
      type: String,
      trim: true,
    },

    photo: {
      url: String,
      publicId: String,
    },

    performanceSummary: {
      type: String,
      trim: true,
    },

    statistics: {
      matches: {
        type: Number,
        default: 0,
      },
      runs: {
        type: Number,
        default: 0,
      },
      wickets: {
        type: Number,
        default: 0,
      },
      goals: {
        type: Number,
        default: 0,
      },
      assists: {
        type: Number,
        default: 0,
      },
      bestPerformance: {
        type: String,
        trim: true,
      },
    },

    skillsRating: {
      batting: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      bowling: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      fielding: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      speed: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      stamina: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      teamwork: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      technique: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
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

module.exports = mongoose.model("Player", playerSchema);