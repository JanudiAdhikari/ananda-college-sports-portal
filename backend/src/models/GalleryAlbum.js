const mongoose = require("mongoose");

const galleryAlbumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Album title is required"],
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "Album slug is required"],
      trim: true,
      lowercase: true,
      unique: true,
    },

    sport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sport",
    },

    eventDate: {
      type: Date,
    },

    description: {
      type: String,
      trim: true,
    },

    coverImage: {
      url: String,
      publicId: String,
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
        caption: String,
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GalleryAlbum", galleryAlbumSchema);