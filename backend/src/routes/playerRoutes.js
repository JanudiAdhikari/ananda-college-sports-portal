const express = require("express");

const {
  getPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
} = require("../controllers/playerController");

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

module.exports = router;