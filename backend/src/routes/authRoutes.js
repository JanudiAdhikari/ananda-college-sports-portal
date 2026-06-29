const express = require("express");

const {
  login,
  getMe,
  getUsers,
  createUser,
  updateUser,
  deactivateUser,
} = require("../controllers/authController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", login);

router.get("/me", protect, getMe);

router.get(
  "/users",
  protect,
  authorize("SUPER_ADMIN", "SPORTS_TEACHER"),
  getUsers
);

router.post(
  "/users",
  protect,
  authorize("SUPER_ADMIN", "SPORTS_TEACHER"),
  createUser
);

router.put(
  "/users/:id",
  protect,
  authorize("SUPER_ADMIN", "SPORTS_TEACHER"),
  updateUser
);

router.delete(
  "/users/:id",
  protect,
  authorize("SUPER_ADMIN", "SPORTS_TEACHER"),
  deactivateUser
);

module.exports = router;