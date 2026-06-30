const express = require("express");

const {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
} = require("../controllers/teamController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getTeams);
router.get("/:id", getTeamById);

router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN", "SPORTS_TEACHER"),
  createTeam
);

router.put(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "SPORTS_TEACHER"),
  updateTeam
);

router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "SPORTS_TEACHER"),
  deleteTeam
);

module.exports = router;