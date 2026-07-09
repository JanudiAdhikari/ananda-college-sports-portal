require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Player = require("../models/Player");
const Team = require("../models/Team");
const Sport = require("../models/Sport");

const playerNames = [
  "Ashan Perera",
  "Bhagya Silva",
  "Chaminda Jayawardene",
  "Dilshan Kumara",
  "Eshan Fernando",
  "Fawaz Mahomed",
  "Gayan Wijesinghe",
  "Hasitha Bandara",
  "Isuru Mendis",
  "Jude Weerakoon",
  "Kamal Herath",
  "Laksith Rajapaksha",
  "Mahesh Gunawardane",
  "Niluka De Silva",
  "Owais Khan",
  "Pradeep Jayasekara",
  "Qasim Ali",
  "Rohan Wijewardena",
  "Saroj Wijethunga",
  "Tharindu Dharshana",
];

const seedPlayers = async () => {
  try {
    await connectDB();

    const teams = await Team.find().populate("sport");
    if (teams.length === 0) {
      console.warn("No teams found. Please seed teams first.");
      process.exit(1);
    }

    const players = [];

    // Create 3-5 players per team
    for (const team of teams) {
      const playerCount = Math.floor(Math.random() * 3) + 3; // 3-5 players

      for (let i = 0; i < playerCount; i++) {
        const playerName = playerNames[Math.floor(Math.random() * playerNames.length)];
        const jerseyNumber = Math.floor(Math.random() * 50) + 1;

        players.push({
          sport: team.sport._id,
          team: team._id,
          fullName: `${playerName} ${i + 1}`,
          admissionNumber: `AC${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, "0")}`,
          dateOfBirth: new Date(2005 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          ageGroup: team.ageGroup,
          jerseyNumber,
          role: ["Batsman", "Bowler", "Fielder", "All-rounder", "Forward", "Midfielder", "Defender", "Goalkeeper"][
            Math.floor(Math.random() * 8)
          ],
          position: ["Top Order", "Middle Order", "Lower Order", "Fast Bowler", "Spinner", "Keeper"][Math.floor(Math.random() * 6)],
          performanceSummary: "Regular performer in school matches.",
          statistics: {
            matches: Math.floor(Math.random() * 30) + 5,
            runs: Math.floor(Math.random() * 1500) + 100,
            wickets: Math.floor(Math.random() * 20),
            goals: Math.floor(Math.random() * 15),
            assists: Math.floor(Math.random() * 10),
            bestPerformance: `${Math.floor(Math.random() * 150) + 50}${Math.floor(Math.random() * 2) === 0 ? " runs" : " not out"}`,
          },
          skillsRating: {
            batting: Math.floor(Math.random() * 40) + 60,
            bowling: Math.floor(Math.random() * 40) + 60,
            fielding: Math.floor(Math.random() * 30) + 70,
            speed: Math.floor(Math.random() * 30) + 70,
            stamina: Math.floor(Math.random() * 30) + 70,
            teamwork: Math.floor(Math.random() * 20) + 80,
            technique: Math.floor(Math.random() * 30) + 70,
          },
        });
      }
    }

    let createdCount = 0;
    let updatedCount = 0;

    for (const playerData of players) {
      const existingPlayer = await Player.findOne({
        team: playerData.team,
        fullName: playerData.fullName,
      });

      if (!existingPlayer) {
        await Player.create(playerData);
        createdCount++;
      } else {
        await Player.findByIdAndUpdate(existingPlayer._id, playerData, { new: true });
        updatedCount++;
      }
    }

    console.log(
      `Players seeding completed. Created: ${createdCount}, Updated: ${updatedCount}`
    );
    process.exit(0);
  } catch (error) {
    console.error(`Players seeding failed: ${error.message}`);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedPlayers();
