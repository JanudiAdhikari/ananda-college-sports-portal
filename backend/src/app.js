const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const sportRoutes = require("./routes/sportRoutes");
const teamRoutes = require("./routes/teamRoutes");
const playerRoutes = require("./routes/playerRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
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
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/sports", sportRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/players", playerRoutes);

module.exports = app;