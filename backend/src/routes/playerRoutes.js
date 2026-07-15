const express = require("express");

const {
  getPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
  uploadPlayerPhoto,
  deletePlayerPhoto,
} = require("../controllers/playerController");

const upload = require("../middleware/uploadMiddleware");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getPlayers);
router.get("/:id", getPlayerById);

router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN", "SPORTS_TEACHER"),
  createPlayer
);

router.put(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "SPORTS_TEACHER"),
  updatePlayer
);

router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "SPORTS_TEACHER"),
  deletePlayer
);

router.put(
  "/:id/photo",
  protect,
  authorize("SUPER_ADMIN", "SPORTS_TEACHER"),
  upload.single("photo"),
  uploadPlayerPhoto
);

router.delete(
  "/:id/photo",
  protect,
  authorize("SUPER_ADMIN", "SPORTS_TEACHER"),
  deletePlayerPhoto
);

module.exports = router;