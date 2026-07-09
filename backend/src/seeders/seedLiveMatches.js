require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const LiveMatch = require("../models/LiveMatch");
const Sport = require("../models/Sport");
const User = require("../models/User");

const opponents = ["Royal College", "Wesley College", "Trinity College", "St. Thomas College", "Colombo Colts"];
const venues = ["Ananda College Ground", "Galle Face Green", "Colombo Cricket Club"];

const seedLiveMatches = async () => {
  try {
    await connectDB();

    const sports = await Sport.find();
    if (sports.length === 0) {
      console.warn("No sports found. Please seed sports first.");
      process.exit(1);
    }

    const admin = await User.findOne({ role: "SUPER_ADMIN" });

    const liveMatches = [
      {
        sport: sports.find(s => s.name === "Cricket")?._id,
        title: "Ananda College vs Royal College - Cricket",
        anandaTeamName: "Ananda College",
        opponentTeamName: opponents[0],
        venue: venues[0],
        matchDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        status: "SCHEDULED",
        score: {
          anandaScore: "",
          opponentScore: "",
          currentStatus: "Match scheduled",
          overs: "",
          wickets: "",
        },
        updatedBy: admin?._id,
        isVisible: true,
      },
      {
        sport: sports.find(s => s.name === "Football")?._id,
        title: "Ananda College vs Wesley College - Football",
        anandaTeamName: "Ananda College",
        opponentTeamName: opponents[1],
        venue: venues[1],
        matchDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        status: "SCHEDULED",
        score: {
          anandaScore: "",
          opponentScore: "",
          currentStatus: "Upcoming match",
          overs: "",
          wickets: "",
        },
        updatedBy: admin?._id,
        isVisible: true,
      },
      {
        sport: sports.find(s => s.name === "Rugby")?._id,
        title: "Ananda College vs Trinity College - Rugby",
        anandaTeamName: "Ananda College",
        opponentTeamName: opponents[2],
        venue: venues[2],
        matchDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago (completed)
        status: "COMPLETED",
        score: {
          anandaScore: "24",
          opponentScore: "21",
          currentStatus: "Match Completed",
          overs: "80 min",
          wickets: "Ananda College Won",
        },
        updates: [
          {
            time: "00:00",
            text: "Match Started",
          },
          {
            time: "20:00",
            text: "Ananda College 10 - 0 Trinity College",
          },
          {
            time: "40:00",
            text: "Ananda College 14 - 7 Trinity College",
          },
          {
            time: "80:00",
            text: "Ananda College 24 - 21 Trinity College - Final Score",
          },
        ],
        updatedBy: admin?._id,
        isVisible: true,
      },
    ];

    let createdCount = 0;
    let updatedCount = 0;

    for (const matchData of liveMatches) {
      if (!matchData.sport) continue;

      const existingMatch = await LiveMatch.findOne({
        sport: matchData.sport,
        title: matchData.title,
      });

      if (!existingMatch) {
        await LiveMatch.create(matchData);
        createdCount++;
      } else {
        await LiveMatch.findByIdAndUpdate(existingMatch._id, matchData, { new: true });
        updatedCount++;
      }
    }

    console.log(
      `Live Matches seeding completed. Created: ${createdCount}, Updated: ${updatedCount}`
    );
    process.exit(0);
  } catch (error) {
    console.error(`Live Matches seeding failed: ${error.message}`);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedLiveMatches();
