const Player = require("../models/Player");
const Team = require("../models/Team");
const Sport = require("../models/Sport");

const getPlayers = async (req, res) => {
  try {
    const { sport, sportSlug, team, ageGroup, search } = req.query;

    const query = {
      isActive: true,
    };

    if (sport) {
      query.sport = sport;
    }

    if (sportSlug) {
      const selectedSport = await Sport.findOne({
        slug: sportSlug,
        isActive: true,
      });

      if (!selectedSport) {
        return res.status(404).json({
          success: false,
          message: "Sport not found.",
        });
      }

      query.sport = selectedSport._id;
    }

    if (team) {
      query.team = team;
    }

    if (ageGroup && ageGroup !== "ALL") {
      query.ageGroup = ageGroup;
    }

    if (search) {
      query.fullName = {
        $regex: search,
        $options: "i",
      };
    }

    const players = await Player.find(query)
      .populate("sport", "name slug category")
      .populate("team", "name ageGroup year")
      .sort({ fullName: 1 });

    res.status(200).json({
      success: true,
      count: players.length,
      players,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch players.",
      error: error.message,
    });
  }
};

const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findOne({
      _id: req.params.id,
      isActive: true,
    })
      .populate("sport", "name slug category")
      .populate("team", "name ageGroup year coachName");

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found.",
      });
    }

    res.status(200).json({
      success: true,
      player,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch player details.",
      error: error.message,
    });
  }
};

const createPlayer = async (req, res) => {
  try {
    const {
      team,
      fullName,
      admissionNumber,
      dateOfBirth,
      ageGroup,
      jerseyNumber,
      role,
      position,
      battingStyle,
      bowlingStyle,
      performanceSummary,
      statistics,
      skillsRating,
      achievements,
    } = req.body;

    if (!team || !fullName) {
      return res.status(400).json({
        success: false,
        message: "Team and player name are required.",
      });
    }

    const selectedTeam = await Team.findOne({
      _id: team,
      isActive: true,
    });

    if (!selectedTeam) {
      return res.status(404).json({
        success: false,
        message: "Selected team not found.",
      });
    }

    const player = await Player.create({
      sport: selectedTeam.sport,
      team,
      fullName,
      admissionNumber,
      dateOfBirth: dateOfBirth || undefined,
      ageGroup: ageGroup || selectedTeam.ageGroup,
      jerseyNumber,
      role,
      position,
      battingStyle,
      bowlingStyle,
      performanceSummary,
      statistics,
      skillsRating,
      achievements,
    });

    const populatedPlayer = await Player.findById(player._id)
      .populate("sport", "name slug category")
      .populate("team", "name ageGroup year");

    res.status(201).json({
      success: true,
      message: "Player created successfully.",
      player: populatedPlayer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create player.",
      error: error.message,
    });
  }
};

const updatePlayer = async (req, res) => {
  try {
    const {
      team,
      fullName,
      admissionNumber,
      dateOfBirth,
      ageGroup,
      jerseyNumber,
      role,
      position,
      battingStyle,
      bowlingStyle,
      performanceSummary,
      statistics,
      skillsRating,
      achievements,
      isActive,
    } = req.body;

    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found.",
      });
    }

    if (team) {
      const selectedTeam = await Team.findOne({
        _id: team,
        isActive: true,
      });

      if (!selectedTeam) {
        return res.status(404).json({
          success: false,
          message: "Selected team not found.",
        });
      }

      player.team = team;
      player.sport = selectedTeam.sport;

      if (!ageGroup) {
        player.ageGroup = selectedTeam.ageGroup;
      }
    }

    if (fullName !== undefined) player.fullName = fullName;
    if (admissionNumber !== undefined) player.admissionNumber = admissionNumber;
    if (dateOfBirth !== undefined) player.dateOfBirth = dateOfBirth || undefined;
    if (ageGroup !== undefined) player.ageGroup = ageGroup;
    if (jerseyNumber !== undefined) player.jerseyNumber = jerseyNumber;
    if (role !== undefined) player.role = role;
    if (position !== undefined) player.position = position;
    if (battingStyle !== undefined) player.battingStyle = battingStyle;
    if (bowlingStyle !== undefined) player.bowlingStyle = bowlingStyle;
    if (performanceSummary !== undefined) {
      player.performanceSummary = performanceSummary;
    }
    if (statistics !== undefined) player.statistics = statistics;
    if (skillsRating !== undefined) player.skillsRating = skillsRating;
    if (achievements !== undefined) player.achievements = achievements;
    if (isActive !== undefined) player.isActive = isActive;

    await player.save();

    const populatedPlayer = await Player.findById(player._id)
      .populate("sport", "name slug category")
      .populate("team", "name ageGroup year");

    res.status(200).json({
      success: true,
      message: "Player updated successfully.",
      player: populatedPlayer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update player.",
      error: error.message,
    });
  }
};

const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found.",
      });
    }

    player.isActive = false;
    await player.save();

    res.status(200).json({
      success: true,
      message: "Player deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete player.",
      error: error.message,
    });
  }
};

module.exports = {
  getPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
};