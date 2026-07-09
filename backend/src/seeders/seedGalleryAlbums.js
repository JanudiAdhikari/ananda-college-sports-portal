require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const GalleryAlbum = require("../models/GalleryAlbum");
const Sport = require("../models/Sport");
const User = require("../models/User");
const createSlug = require("../utils/createSlug");

const albumTitles = [
  "Cricket Finals 2024",
  "Annual Sports Day",
  "Football Tournament",
  "Swimming Gala",
  "Athletics Meet",
  "Volleyball Championship",
  "Inter-house Games",
  "Rugby Festival",
  "Basketball Tournament",
  "Annual Prize Giving",
  "Sports Day Opening Ceremony",
  "Team Photo Sessions",
];

const seedGalleryAlbums = async () => {
  try {
    await connectDB();

    const sports = await Sport.find();
    if (sports.length === 0) {
      console.warn("No sports found. Please seed sports first.");
      process.exit(1);
    }

    const admin = await User.findOne({ role: "SUPER_ADMIN" });

    const albums = [];

    for (let i = 0; i < 12; i++) {
      const title = albumTitles[i];
      const sport = sports[Math.floor(Math.random() * sports.length)];
      const daysAgo = Math.floor(Math.random() * 60);

      albums.push({
        title,
        slug: createSlug(title),
        sport: sport._id,
        eventDate: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
        description: `Event captured during ${title}. This album contains memorable moments from the event.`,
        images: [
          {
            url: `https://images.unsplash.com/photo-${1500000000 + i}?w=800`,
            publicId: `album-${i}-image-1`,
            caption: `${title} - Moment 1`,
            uploadedBy: admin?._id,
          },
          {
            url: `https://images.unsplash.com/photo-${1500000001 + i}?w=800`,
            publicId: `album-${i}-image-2`,
            caption: `${title} - Moment 2`,
            uploadedBy: admin?._id,
          },
          {
            url: `https://images.unsplash.com/photo-${1500000002 + i}?w=800`,
            publicId: `album-${i}-image-3`,
            caption: `${title} - Moment 3`,
            uploadedBy: admin?._id,
          },
        ],
        coverImage: {
          url: `https://images.unsplash.com/photo-${1500000000 + i}?w=800`,
          publicId: `album-${i}-cover`,
        },
        createdBy: admin?._id,
        isPublished: true,
      });
    }

    let createdCount = 0;
    let updatedCount = 0;

    for (const albumData of albums) {
      const existingAlbum = await GalleryAlbum.findOne({
        slug: albumData.slug,
      });

      if (!existingAlbum) {
        await GalleryAlbum.create(albumData);
        createdCount++;
      } else {
        await GalleryAlbum.findByIdAndUpdate(existingAlbum._id, albumData, { new: true });
        updatedCount++;
      }
    }

    console.log(
      `Gallery Albums seeding completed. Created: ${createdCount}, Updated: ${updatedCount}`
    );
    process.exit(0);
  } catch (error) {
    console.error(`Gallery Albums seeding failed: ${error.message}`);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedGalleryAlbums();
