const express = require("express");

const {
  login,
  getMe,
  createUser,
} = require("../controllers/authController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", login);

router.get("/me", protect, getMe);

router.post(
  "/users",
  protect,
  authorize("SUPER_ADMIN", "SPORTS_TEACHER"),
  createUser
);

module.exports = router;