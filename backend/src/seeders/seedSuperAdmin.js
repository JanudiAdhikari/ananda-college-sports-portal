require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

const seedSuperAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({
      username: process.env.SUPER_ADMIN_USERNAME,
    });

    if (existingAdmin) {
      console.log("Super admin already exists.");
      process.exit(0);
    }

    await User.create({
      fullName: process.env.SUPER_ADMIN_FULL_NAME,
      username: process.env.SUPER_ADMIN_USERNAME,
      password: process.env.SUPER_ADMIN_PASSWORD,
      role: "SUPER_ADMIN",
    });

    console.log("Super admin created successfully.");
    process.exit(0);
  } catch (error) {
    console.error(`Seeder failed: ${error.message}`);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedSuperAdmin();