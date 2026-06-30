const express = require("express");

const {
  getGalleryAlbums,
  getGalleryAlbumBySlug,
  createGalleryAlbum,
  updateGalleryAlbum,
  deleteGalleryAlbum,
  uploadAlbumImages,
  deleteAlbumImage,
} = require("../controllers/galleryController");

const upload = require("../middleware/uploadMiddleware");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

const galleryManagers = ["SUPER_ADMIN", "SPORTS_TEACHER", "PHOTO_CLUB"];

router.get("/albums", getGalleryAlbums);
router.get("/albums/:slug", getGalleryAlbumBySlug);

router.post(
  "/albums",
  protect,
  authorize(...galleryManagers),
  createGalleryAlbum
);

router.put(
  "/albums/:id",
  protect,
  authorize(...galleryManagers),
  updateGalleryAlbum
);

router.delete(
  "/albums/:id",
  protect,
  authorize(...galleryManagers),
  deleteGalleryAlbum
);

router.post(
  "/albums/:id/images",
  protect,
  authorize(...galleryManagers),
  upload.array("images", 20),
  uploadAlbumImages
);

router.delete(
  "/albums/:albumId/images/:imageId",
  protect,
  authorize(...galleryManagers),
  deleteAlbumImage
);

module.exports = router;