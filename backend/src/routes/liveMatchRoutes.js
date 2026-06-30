const express = require("express");

const {
  getLiveMatches,
  getLiveMatchById,
  createLiveMatch,
  updateLiveMatch,
  updateLiveScore,
  deleteLiveMatch,
} = require("../controllers/liveMatchController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

const liveMatchManagers = ["SUPER_ADMIN", "SPORTS_TEACHER", "VIDEO_CLUB"];

router.get("/", getLiveMatches);
router.get("/:id", getLiveMatchById);

router.post(
  "/",
  protect,
  authorize(...liveMatchManagers),
  createLiveMatch
);

router.put(
  "/:id",
  protect,
  authorize(...liveMatchManagers),
  updateLiveMatch
);

router.patch(
  "/:id/score",
  protect,
  authorize(...liveMatchManagers),
  updateLiveScore
);

router.delete(
  "/:id",
  protect,
  authorize(...liveMatchManagers),
  deleteLiveMatch
);

module.exports = router;