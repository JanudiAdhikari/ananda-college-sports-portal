const express = require("express");

const {
  getFixtures,
  getFixtureById,
  createFixture,
  updateFixture,
  deleteFixture,
} = require("../controllers/fixtureController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getFixtures);
router.get("/:id", getFixtureById);

router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN", "SPORTS_TEACHER"),
  createFixture
);

router.put(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "SPORTS_TEACHER"),
  updateFixture
);

router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "SPORTS_TEACHER"),
  deleteFixture
);

module.exports = router;