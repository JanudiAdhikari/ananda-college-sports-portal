require("dotenv").config();

const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

const seedUsers = async () => {
  try {
    await connectDB();

    const users = [
      {
        fullName: "Sports Teacher One",
        username: "sports_teacher1",
        email: "sports1@anandacollege.edu",
        password: "SportPass@123",
        role: "SPORTS_TEACHER",
      },
      {
        fullName: "Sports Teacher Two",
        username: "sports_teacher2",
        email: "sports2@anandacollege.edu",
        password: "SportPass@123",
        role: "SPORTS_TEACHER",
      },
      {
        fullName: "Photo Club Manager",
        username: "photo_club",
        email: "photoclub@anandacollege.edu",
        password: "PhotoPass@123",
        role: "PHOTO_CLUB",
      },
      {
        fullName: "Video Club Manager",
        username: "video_club",
        email: "videoclub@anandacollege.edu",
        password: "VideoPass@123",
        role: "VIDEO_CLUB",
      },
    ];

    let createdCount = 0;
    let updatedCount = 0;

    for (const userData of users) {
      const existingUser = await User.findOne({
        $or: [{ username: userData.username }, { email: userData.email }],
      });

      if (!existingUser) {
        // Hash password
        const hashedPassword = await bcryptjs.hash(userData.password, 10);

        await User.create({
          ...userData,
          password: hashedPassword,
        });

        console.log(`Created user: ${userData.fullName} (${userData.role})`);
        createdCount++;
      } else {
        console.log(`User already exists: ${userData.fullName}`);
        updatedCount++;
      }
    }

    console.log(
      `Users seeding completed. Created: ${createdCount}, Already exists: ${updatedCount}`
    );
    process.exit(0);
  } catch (error) {
    console.error(`Users seeding failed: ${error.message}`);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedUsers();
