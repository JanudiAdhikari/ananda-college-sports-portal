const { Readable } = require("stream");

const GalleryAlbum = require("../models/GalleryAlbum");
const Sport = require("../models/Sport");
const cloudinary = require("../config/cloudinary");
const createSlug = require("../utils/createSlug");

const uploadImageToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

const getGalleryAlbums = async (req, res) => {
  try {
    const { search, sport } = req.query;

    const query = {
      isPublished: true,
    };

    if (search) {
      query.title = {
        $regex: search,
        $options: "i",
      };
    }

    if (sport && sport !== "ALL") {
      query.sport = sport;
    }

    const albums = await GalleryAlbum.find(query)
      .populate("sport", "name slug category")
      .populate("createdBy", "fullName role")
      .sort({ eventDate: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: albums.length,
      albums,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch gallery albums.",
      error: error.message,
    });
  }
};

const getGalleryAlbumBySlug = async (req, res) => {
  try {
    const album = await GalleryAlbum.findOne({
      slug: req.params.slug,
      isPublished: true,
    })
      .populate("sport", "name slug category")
      .populate("createdBy", "fullName role")
      .populate("images.uploadedBy", "fullName role");

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Gallery album not found.",
      });
    }

    res.status(200).json({
      success: true,
      album,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch gallery album.",
      error: error.message,
    });
  }
};

const createGalleryAlbum = async (req, res) => {
  try {
    const { title, sport, eventDate, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Album title is required.",
      });
    }

    let selectedSport = null;

    if (sport) {
      selectedSport = await Sport.findOne({
        _id: sport,
        isActive: true,
      });

      if (!selectedSport) {
        return res.status(404).json({
          success: false,
          message: "Selected sport not found.",
        });
      }
    }

    const slug = createSlug(title);

    const existingAlbum = await GalleryAlbum.findOne({ slug });

    if (existingAlbum) {
      return res.status(409).json({
        success: false,
        message: "An album with this title already exists.",
      });
    }

    const album = await GalleryAlbum.create({
      title,
      slug,
      sport: selectedSport?._id,
      eventDate: eventDate || undefined,
      description,
      createdBy: req.user._id,
    });

    const populatedAlbum = await GalleryAlbum.findById(album._id)
      .populate("sport", "name slug category")
      .populate("createdBy", "fullName role");

    res.status(201).json({
      success: true,
      message: "Gallery album created successfully.",
      album: populatedAlbum,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create gallery album.",
      error: error.message,
    });
  }
};

const updateGalleryAlbum = async (req, res) => {
  try {
    const { title, sport, eventDate, description, isPublished } = req.body;

    const album = await GalleryAlbum.findById(req.params.id);

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Gallery album not found.",
      });
    }

    if (title && title !== album.title) {
      const newSlug = createSlug(title);

      const existingAlbum = await GalleryAlbum.findOne({
        _id: { $ne: album._id },
        slug: newSlug,
      });

      if (existingAlbum) {
        return res.status(409).json({
          success: false,
          message: "Another album with this title already exists.",
        });
      }

      album.title = title;
      album.slug = newSlug;
    }

    if (sport !== undefined) {
      if (sport) {
        const selectedSport = await Sport.findOne({
          _id: sport,
          isActive: true,
        });

        if (!selectedSport) {
          return res.status(404).json({
            success: false,
            message: "Selected sport not found.",
          });
        }

        album.sport = sport;
      } else {
        album.sport = undefined;
      }
    }

    if (eventDate !== undefined) album.eventDate = eventDate || undefined;
    if (description !== undefined) album.description = description;
    if (isPublished !== undefined) album.isPublished = isPublished;

    await album.save();

    const populatedAlbum = await GalleryAlbum.findById(album._id)
      .populate("sport", "name slug category")
      .populate("createdBy", "fullName role");

    res.status(200).json({
      success: true,
      message: "Gallery album updated successfully.",
      album: populatedAlbum,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update gallery album.",
      error: error.message,
    });
  }
};

const deleteGalleryAlbum = async (req, res) => {
  try {
    const album = await GalleryAlbum.findById(req.params.id);

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Gallery album not found.",
      });
    }

    album.isPublished = false;
    await album.save();

    res.status(200).json({
      success: true,
      message: "Gallery album deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete gallery album.",
      error: error.message,
    });
  }
};

const uploadAlbumImages = async (req, res) => {
  try {
    const album = await GalleryAlbum.findById(req.params.id);

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Gallery album not found.",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one image.",
      });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      const result = await uploadImageToCloudinary(
        file.buffer,
        "ananda-sports-gallery"
      );

      uploadedImages.push({
        url: result.secure_url,
        publicId: result.public_id,
        caption: "",
        uploadedBy: req.user._id,
      });
    }

    album.images.push(...uploadedImages);

    if (!album.coverImage?.url && uploadedImages.length > 0) {
      album.coverImage = {
        url: uploadedImages[0].url,
        publicId: uploadedImages[0].publicId,
      };
    }

    await album.save();

    const updatedAlbum = await GalleryAlbum.findById(album._id)
      .populate("sport", "name slug category")
      .populate("createdBy", "fullName role")
      .populate("images.uploadedBy", "fullName role");

    res.status(200).json({
      success: true,
      message: "Images uploaded successfully.",
      album: updatedAlbum,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to upload images.",
      error: error.message,
    });
  }
};

const deleteAlbumImage = async (req, res) => {
  try {
    const { albumId, imageId } = req.params;

    const album = await GalleryAlbum.findById(albumId);

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Gallery album not found.",
      });
    }

    const image = album.images.id(imageId);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found.",
      });
    }

    await cloudinary.uploader.destroy(image.publicId);

    album.images.pull({ _id: imageId });

    if (album.coverImage?.publicId === image.publicId) {
      const nextCoverImage = album.images[0];

      album.coverImage = nextCoverImage
        ? {
            url: nextCoverImage.url,
            publicId: nextCoverImage.publicId,
          }
        : undefined;
    }

    await album.save();

    res.status(200).json({
      success: true,
      message: "Image deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete image.",
      error: error.message,
    });
  }
};

module.exports = {
  getGalleryAlbums,
  getGalleryAlbumBySlug,
  createGalleryAlbum,
  updateGalleryAlbum,
  deleteGalleryAlbum,
  uploadAlbumImages,
  deleteAlbumImage,
};