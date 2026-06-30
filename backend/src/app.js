const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const sportRoutes = require("./routes/sportRoutes");
const teamRoutes = require("./routes/teamRoutes");
const playerRoutes = require("./routes/playerRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const liveMatchRoutes = require("./routes/liveMatchRoutes");
const fixtureRoutes = require("./routes/fixtureRoutes");

const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : [process.env.CLIENT_URL || "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Ananda College Sports Portal API is running");
});

app.get("/api/health", (req, res) => {
  const dbStatus = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.status(200).json({
    success: true,
    message: "Backend server is healthy",
    database: dbStatus[mongoose.connection.readyState],
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/sports", sportRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/live-matches", liveMatchRoutes);
app.use("/api/fixtures", fixtureRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;