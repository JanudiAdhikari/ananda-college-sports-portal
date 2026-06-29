const express = require("express");

const {
  getSports,
  getSportBySlug,
  createSport,
  updateSport,
  deleteSport,
} = require("../controllers/sportController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getSports);
router.get("/:slug", getSportBySlug);

router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN", "SPORTS_TEACHER"),
  createSport
);

router.put(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "SPORTS_TEACHER"),
  updateSport
);

router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "SPORTS_TEACHER"),
  deleteSport
);

module.exports = router;