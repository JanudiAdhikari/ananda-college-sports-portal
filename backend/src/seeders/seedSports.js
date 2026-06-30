require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Sport = require("../models/Sport");
const createSlug = require("../utils/createSlug");

const sports = [
  {
    name: "Cricket",
    category: "TEAM",
    description:
      "Cricket is one of the leading sports at Ananda College with junior and senior teams.",
    displayOrder: 1,
  },
  {
    name: "Rugby",
    category: "TEAM",
    description:
      "Rugby teams represent Ananda College in school-level tournaments and annual encounters.",
    displayOrder: 2,
  },
  {
    name: "Football",
    category: "TEAM",
    description:
      "Football at Ananda College includes junior and senior teams with regular fixtures.",
    displayOrder: 3,
  },
  {
    name: "Athletics",
    category: "ATHLETICS",
    description:
      "Athletics includes track and field events, inter-house competitions, and school records.",
    displayOrder: 4,
  },
  {
    name: "Swimming",
    category: "AQUATIC",
    description:
      "Swimming represents aquatic sports achievements and student participation.",
    displayOrder: 5,
  },
];

const seedSports = async () => {
  try {
    await connectDB();

    for (const sportData of sports) {
      const slug = createSlug(sportData.name);

      const existingSport = await Sport.findOne({ slug });

      if (!existingSport) {
        await Sport.create({
          ...sportData,
          slug,
        });

        console.log(`${sportData.name} created`);
      } else {
        console.log(`${sportData.name} already exists`);
      }
    }

    console.log("Sports seeding completed.");
    process.exit(0);
  } catch (error) {
    console.error(`Sports seeding failed: ${error.message}`);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedSports();