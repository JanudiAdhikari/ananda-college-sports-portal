require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Fixture = require("../models/Fixture");
const Team = require("../models/Team");
const Sport = require("../models/Sport");

const opponents = [
  "Royal College",
  "St. Thomas College",
  "Wesley College",
  "Colombo Colts",
  "Trinity College",
  "St. Peter's College",
  "D.S. Senanayake College",
  "S. Thomas College",
  "Nalanda College",
  "Ladies College",
  "Viharamaha Devi Park Team",
  "Colombo District Team",
];

const venues = [
  "Ananda College Ground",
  "Galle Face Green",
  "Colombo Cricket Club",
  "Ananda College Indoor Stadium",
  "Rangiri Dambulla Sports Complex",
  "Asgiriya Grounds",
  "Local School Ground",
  "National Sports Stadium",
];

const seedFixtures = async () => {
  try {
    await connectDB();

    const teams = await Team.find().populate("sport");
    if (teams.length === 0) {
      console.warn("No teams found. Please seed teams first.");
      process.exit(1);
    }

    const fixtures = [];
    const now = new Date();

    for (const team of teams) {
      // Create 3-4 fixtures per team
      const fixtureCount = Math.floor(Math.random() * 2) + 3;

      for (let i = 0; i < fixtureCount; i++) {
        // Mix of upcoming, completed, and other statuses
        const daysOffset = Math.floor(Math.random() * 60) - 30; // -30 to +30 days from now
        const matchDate = new Date(now.getTime() + daysOffset * 24 * 60 * 60 * 1000);

        let status = "UPCOMING";
        let result = null;

        if (daysOffset < 0) {
          status = "COMPLETED";
          result = {
            anandaScore: String(Math.floor(Math.random() * 200) + 50),
            opponentScore: String(Math.floor(Math.random() * 200) + 50),
            resultText: ["Won", "Lost", "Draw"][Math.floor(Math.random() * 3)],
            summary: "Match summary will appear here with highlights.",
          };
        }

        fixtures.push({
          sport: team.sport._id,
          team: team._id,
          title: `${team.sport.name} - ${team.name} vs ${opponents[Math.floor(Math.random() * opponents.length)]}`,
          opponent: opponents[Math.floor(Math.random() * opponents.length)],
          venue: venues[Math.floor(Math.random() * venues.length)],
          matchDate,
          matchType: ["FRIENDLY", "TOURNAMENT", "BIG_MATCH", "ANNUAL_ENCOUNTER"][Math.floor(Math.random() * 4)],
          status,
          result,
          isFeatured: Math.random() > 0.7, // 30% featured
        });
      }
    }

    let createdCount = 0;
    let updatedCount = 0;

    for (const fixtureData of fixtures) {
      const existingFixture = await Fixture.findOne({
        team: fixtureData.team,
        title: fixtureData.title,
        matchDate: fixtureData.matchDate,
      });

      if (!existingFixture) {
        await Fixture.create(fixtureData);
        createdCount++;
      } else {
        await Fixture.findByIdAndUpdate(existingFixture._id, fixtureData, { new: true });
        updatedCount++;
      }
    }

    console.log(
      `Fixtures seeding completed. Created: ${createdCount}, Updated: ${updatedCount}`
    );
    process.exit(0);
  } catch (error) {
    console.error(`Fixtures seeding failed: ${error.message}`);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedFixtures();
