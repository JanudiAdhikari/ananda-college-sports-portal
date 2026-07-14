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
        fullName: "Photography Club",
        username: "photo_club",
        email: "photoclub@anandacollege.edu",
        password: "PhotoPass@123",
        role: "PHOTO_CLUB",
      },
      {
        fullName: "Videography Club",
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
        await User.create(userData);
        console.log(`Created user: ${userData.fullName} (${userData.role})`);
        createdCount++;
      } else {
        // Update password and details to trigger User pre-save hook and correct the hashed password
        existingUser.fullName = userData.fullName;
        existingUser.password = userData.password;
        existingUser.role = userData.role;
        await existingUser.save();
        console.log(`Updated user: ${userData.fullName} (${userData.role})`);
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
