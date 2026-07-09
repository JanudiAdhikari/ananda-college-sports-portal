require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Team = require("../models/Team");
const Sport = require("../models/Sport");

const seedTeams = async () => {
  try {
    await connectDB();

    const sports = await Sport.find();
    if (sports.length === 0) {
      console.warn("No sports found. Please seed sports first.");
      process.exit(1);
    }

    const teams = [
      // Cricket Teams
      {
        sport: sports.find(s => s.name === "Cricket")?._id,
        name: "Cricket - First Team",
        ageGroup: "FIRST_TEAM",
        year: 2024,
        coachName: "Mr. Sunil Perera",
        assistantCoachName: "Mr. Rohan Silva",
        summary: "Senior cricket team representing Ananda College in premier competitions.",
      },
      {
        sport: sports.find(s => s.name === "Cricket")?._id,
        name: "Cricket - Under 16",
        ageGroup: "UNDER_16",
        year: 2024,
        coachName: "Mr. Chaminda Jayawardene",
        assistantCoachName: "Mr. Mahesh Gunawardane",
        summary: "Developing young cricket talent for the school.",
      },
      // Football Teams
      {
        sport: sports.find(s => s.name === "Football")?._id,
        name: "Football - First Team",
        ageGroup: "FIRST_TEAM",
        year: 2024,
        coachName: "Mr. Udaya Bandara",
        assistantCoachName: "Mr. Arjuna Perera",
        summary: "Premier football team of Ananda College.",
      },
      {
        sport: sports.find(s => s.name === "Football")?._id,
        name: "Football - Under 14",
        ageGroup: "UNDER_14",
        year: 2024,
        coachName: "Mr. Nimal Silva",
        assistantCoachName: "Mr. Sanjeewa Kumara",
        summary: "Junior football development team.",
      },
      // Rugby Teams
      {
        sport: sports.find(s => s.name === "Rugby")?._id,
        name: "Rugby - First Team",
        ageGroup: "FIRST_TEAM",
        year: 2024,
        coachName: "Mr. Lakshan Wijesinghe",
        assistantCoachName: "Mr. Ravi Kumarage",
        summary: "Elite rugby team competing at school level.",
      },
      // Basketball Teams
      {
        sport: sports.find(s => s.name === "Basketball")?._id,
        name: "Basketball - First Team",
        ageGroup: "FIRST_TEAM",
        year: 2024,
        coachName: "Mr. Kasun Herath",
        assistantCoachName: "Mr. Dilshan Mendis",
        summary: "Dynamic basketball team excelling in tournaments.",
      },
      // Volleyball Teams
      {
        sport: sports.find(s => s.name === "Volleyball")?._id,
        name: "Volleyball - Senior",
        ageGroup: "SENIOR",
        year: 2024,
        coachName: "Miss. Anushka Jayasinghe",
        assistantCoachName: "Miss. Divya Fernando",
        summary: "Competitive volleyball team at inter-school level.",
      },
      // Hockey Teams
      {
        sport: sports.find(s => s.name === "Hockey")?._id,
        name: "Hockey - First Team",
        ageGroup: "FIRST_TEAM",
        year: 2024,
        coachName: "Mr. Anil Sharma",
        assistantCoachName: "Mr. Pradeep Wickramasinghe",
        summary: "Fast-paced hockey team with strong tradition.",
      },
      // Swimming
      {
        sport: sports.find(s => s.name === "Swimming")?._id,
        name: "Swimming - Open",
        ageGroup: "OPEN",
        year: 2024,
        coachName: "Mr. Sanjaya Kumar",
        assistantCoachName: "Miss. Amali De Silva",
        summary: "Competitive swimming team across all age groups.",
      },
      // Athletics
      {
        sport: sports.find(s => s.name === "Athletics")?._id,
        name: "Athletics - Track & Field",
        ageGroup: "OPEN",
        year: 2024,
        coachName: "Mr. Viraj Perera",
        assistantCoachName: "Mr. Sunesh Kumar",
        summary: "Track and field athletes representing Ananda College.",
      },
    ];

    let createdCount = 0;
    let updatedCount = 0;

    for (const teamData of teams) {
      if (!teamData.sport) continue;

      const existingTeam = await Team.findOne({
        sport: teamData.sport,
        name: teamData.name,
      });

      if (!existingTeam) {
        await Team.create(teamData);
        createdCount++;
      } else {
        await Team.findByIdAndUpdate(existingTeam._id, teamData, { new: true });
        updatedCount++;
      }
    }

    console.log(
      `Teams seeding completed. Created: ${createdCount}, Updated: ${updatedCount}`
    );
    process.exit(0);
  } catch (error) {
    console.error(`Teams seeding failed: ${error.message}`);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedTeams();
