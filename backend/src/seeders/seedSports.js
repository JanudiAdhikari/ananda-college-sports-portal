require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Sport = require("../models/Sport");
const createSlug = require("../utils/createSlug");

const sports = [
  {
    name: "Athletics",
    category: "ATHLETICS",
    description:
      "Athletics develops speed, endurance, strength, and discipline through track and field events that inspire school pride.",
    displayOrder: 1,
  },
  {
    name: "Mountaineering",
    category: "OTHER",
    description:
      "Mountaineering encourages courage, resilience, and teamwork through exploration, hiking, and outdoor adventure.",
    displayOrder: 2,
  },
  {
    name: "Rugby",
    category: "TEAM",
    description:
      "Rugby builds physical strength, tactical awareness, and unity through fast-paced team play.",
    displayOrder: 3,
  },
  {
    name: "Badminton",
    category: "INDIVIDUAL",
    description:
      "Badminton sharpens reflexes, stamina, and focus while offering exciting singles and doubles competition.",
    displayOrder: 4,
  },
  {
    name: "Basketball",
    category: "TEAM",
    description:
      "Basketball promotes teamwork, coordination, and strategic play through dynamic court action.",
    displayOrder: 5,
  },
  {
    name: "Table Tennis",
    category: "INDIVIDUAL",
    description:
      "Table tennis is a fast, skill-based sport that rewards precision, control, and concentration.",
    displayOrder: 6,
  },
  {
    name: "Tennis",
    category: "INDIVIDUAL",
    description:
      "Tennis develops agility, endurance, and composure through technical rallies and match discipline.",
    displayOrder: 7,
  },
  {
    name: "Rowing",
    category: "OTHER",
    description:
      "Rowing strengthens endurance and coordination while emphasizing discipline, rhythm, and collective effort.",
    displayOrder: 8,
  },
  {
    name: "Hockey",
    category: "TEAM",
    description:
      "Hockey combines speed, teamwork, and tactical awareness in a highly competitive team sport.",
    displayOrder: 9,
  },
  {
    name: "Volleyball",
    category: "TEAM",
    description:
      "Volleyball highlights communication, timing, and teamwork in a fast and exciting indoor game.",
    displayOrder: 10,
  },
  {
    name: "Beach Volleyball",
    category: "TEAM",
    description:
      "Beach volleyball brings the same energy and teamwork to the sand with a unique outdoor challenge.",
    displayOrder: 11,
  },
  {
    name: "Football",
    category: "TEAM",
    description:
      "Football continues to be one of the school’s most popular team sports, celebrated for passion and teamwork.",
    displayOrder: 12,
  },
  {
    name: "Swimming",
    category: "AQUATIC",
    description:
      "Swimming builds confidence, endurance, and technique while promoting healthy aquatic skill development.",
    displayOrder: 13,
  },
  {
    name: "Gymnastics",
    category: "INDIVIDUAL",
    description:
      "Gymnastics showcases flexibility, balance, strength, and artistic control through disciplined practice.",
    displayOrder: 14,
  },
  {
    name: "Aerobic Gymnastics",
    category: "INDIVIDUAL",
    description:
      "Aerobic gymnastics blends rhythm, conditioning, and choreography into a dynamic performance sport.",
    displayOrder: 15,
  },
  {
    name: "Lifesaving",
    category: "AQUATIC",
    description:
      "Lifesaving teaches water safety, rescue techniques, and confidence in and around aquatic environments.",
    displayOrder: 16,
  },
  {
    name: "Scouting",
    category: "OTHER",
    description:
      "Scouting develops leadership, responsibility, and outdoor skills through service and adventure.",
    displayOrder: 17,
  },
  {
    name: "Archery",
    category: "INDIVIDUAL",
    description:
      "Archery focuses on precision, patience, and control while encouraging calm concentration.",
    displayOrder: 18,
  },
  {
    name: "Golf",
    category: "INDIVIDUAL",
    description:
      "Golf nurtures accuracy, strategy, and composure through a thoughtful and elegant game.",
    displayOrder: 19,
  },
  {
    name: "Chess",
    category: "INDIVIDUAL",
    description:
      "Chess strengthens logical thinking, planning, and concentration through strategic competition.",
    displayOrder: 20,
  },
  {
    name: "Water Polo",
    category: "AQUATIC",
    description:
      "Water polo combines swimming endurance, teamwork, and tactical play in a challenging aquatic sport.",
    displayOrder: 21,
  },
  {
    name: "Wushu",
    category: "INDIVIDUAL",
    description:
      "Wushu combines martial arts discipline with graceful movement, balance, and control.",
    displayOrder: 22,
  },
  {
    name: "Karate",
    category: "INDIVIDUAL",
    description:
      "Karate emphasizes discipline, technique, and self-control through structured martial arts training.",
    displayOrder: 23,
  },
  {
    name: "Boxing",
    category: "INDIVIDUAL",
    description:
      "Boxing builds fitness, resilience, and precision while promoting respect and sportsmanship.",
    displayOrder: 24,
  },
  {
    name: "Judo",
    category: "INDIVIDUAL",
    description:
      "Judo develops balance, discipline, and technical skill through controlled throws and grappling.",
    displayOrder: 25,
  },
  {
    name: "Taekwondo",
    category: "INDIVIDUAL",
    description:
      "Taekwondo encourages focus, flexibility, and confidence through dynamic kicking techniques.",
    displayOrder: 26,
  },
  {
    name: "Roller Skating",
    category: "INDIVIDUAL",
    description:
      "Roller skating develops balance, coordination, and speed in a fun and energetic activity.",
    displayOrder: 27,
  },
  {
    name: "Weightlifting",
    category: "INDIVIDUAL",
    description:
      "Weightlifting strengthens power, technique, and determination through disciplined training.",
    displayOrder: 28,
  },
  {
    name: "Powerlifting",
    category: "INDIVIDUAL",
    description:
      "Powerlifting focuses on strength, technique, and perseverance in core barbell disciplines.",
    displayOrder: 29,
  },
  {
    name: "Carrom",
    category: "INDIVIDUAL",
    description:
      "Carrom challenges concentration, strategy, and precision in a traditional tabletop sport.",
    displayOrder: 30,
  },
  {
    name: "Handball",
    category: "TEAM",
    description:
      "Handball combines speed, teamwork, and quick decision-making in an exciting fast-paced game.",
    displayOrder: 31,
  },
  {
    name: "Cricket",
    category: "TEAM",
    description:
      "Cricket remains one of the most cherished school sports, celebrated for teamwork, strategy, and tradition.",
    displayOrder: 32,
  },
  {
    name: "Cadet Corps",
    category: "OTHER",
    description:
      "Cadet Corps nurtures discipline, leadership, and service through structured training and teamwork.",
    displayOrder: 33,
  },
  {
    name: "Junior Cadet Corps",
    category: "OTHER",
    description:
      "Junior Cadet Corps introduces younger students to discipline, leadership, and responsibility.",
    displayOrder: 34,
  },
  {
    name: "Police Cadet Corps",
    category: "OTHER",
    description:
      "Police Cadet Corps develops civic awareness, discipline, and responsibility through practical training.",
    displayOrder: 35,
  },
  {
    name: "Cadet Band",
    category: "OTHER",
    description:
      "Cadet Band brings together rhythm, coordination, and teamwork through spirited musical performance.",
    displayOrder: 36,
  },
  {
    name: "Squash",
    category: "INDIVIDUAL",
    description:
      "Squash is a fast and demanding racket sport that rewards agility, endurance, and focus.",
    displayOrder: 37,
  },
  {
    name: "Shooting",
    category: "INDIVIDUAL",
    description:
      "Shooting develops concentration, control, and composure through accuracy and discipline.",
    displayOrder: 38,
  },
  {
    name: "Kabaddi",
    category: "TEAM",
    description:
      "Kabaddi is a fast, tactical contact sport that highlights strength, strategy, and team coordination.",
    displayOrder: 39,
  },
  {
    name: "Baseball",
    category: "TEAM",
    description:
      "Baseball encourages teamwork, timing, and precision in a strategic and highly engaging game.",
    displayOrder: 40,
  },
  {
    name: "Softball Cricket",
    category: "TEAM",
    description:
      "Softball cricket offers a fast-paced, accessible version of the game with strong team spirit.",
    displayOrder: 41,
  },
  {
    name: "Elle",
    category: "OTHER",
    description:
      "Elle is a recognized school activity that encourages discipline, coordination, and creative expression.",
    displayOrder: 42,
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
        await Sport.findByIdAndUpdate(
          existingSport._id,
          {
            ...sportData,
            slug,
          },
          { new: true }
        );

        console.log(`${sportData.name} updated`);
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