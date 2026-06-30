const Team = require("../models/Team");
const Sport = require("../models/Sport");

const getTeams = async (req, res) => {
  try {
    const { sport, sportSlug, ageGroup, year } = req.query;

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

    if (ageGroup && ageGroup !== "ALL") {
      query.ageGroup = ageGroup;
    }

    if (year) {
      query.year = Number(year);
    }

    const teams = await Team.find(query)
      .populate("sport", "name slug category")
      .populate("captain", "fullName")
      .populate("viceCaptain", "fullName")
      .sort({ year: -1, ageGroup: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: teams.length,
      teams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch teams.",
      error: error.message,
    });
  }
};

const getTeamById = async (req, res) => {
  try {
    const team = await Team.findOne({
      _id: req.params.id,
      isActive: true,
    })
      .populate("sport", "name slug category")
      .populate("captain", "fullName")
      .populate("viceCaptain", "fullName");

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found.",
      });
    }

    res.status(200).json({
      success: true,
      team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch team details.",
      error: error.message,
    });
  }
};

const createTeam = async (req, res) => {
  try {
    const {
      sport,
      name,
      ageGroup,
      year,
      coachName,
      assistantCoachName,
      summary,
      achievements,
    } = req.body;

    if (!sport || !name || !ageGroup || !year) {
      return res.status(400).json({
        success: false,
        message: "Sport, team name, age group, and year are required.",
      });
    }

    const selectedSport = await Sport.findById(sport);

    if (!selectedSport || !selectedSport.isActive) {
      return res.status(404).json({
        success: false,
        message: "Selected sport not found.",
      });
    }

    const existingTeam = await Team.findOne({
      sport,
      name,
      ageGroup,
      year,
      isActive: true,
    });

    if (existingTeam) {
      return res.status(409).json({
        success: false,
        message: "This team already exists for the selected sport and year.",
      });
    }

    const team = await Team.create({
      sport,
      name,
      ageGroup,
      year,
      coachName,
      assistantCoachName,
      summary,
      achievements,
    });

    const populatedTeam = await Team.findById(team._id).populate(
      "sport",
      "name slug category"
    );

    res.status(201).json({
      success: true,
      message: "Team created successfully.",
      team: populatedTeam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create team.",
      error: error.message,
    });
  }
};

const updateTeam = async (req, res) => {
  try {
    const {
      sport,
      name,
      ageGroup,
      year,
      coachName,
      assistantCoachName,
      captain,
      viceCaptain,
      summary,
      achievements,
      isActive,
    } = req.body;

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found.",
      });
    }

    if (sport) {
      const selectedSport = await Sport.findById(sport);

      if (!selectedSport || !selectedSport.isActive) {
        return res.status(404).json({
          success: false,
          message: "Selected sport not found.",
        });
      }

      team.sport = sport;
    }

    if (name !== undefined) team.name = name;
    if (ageGroup !== undefined) team.ageGroup = ageGroup;
    if (year !== undefined) team.year = Number(year);
    if (coachName !== undefined) team.coachName = coachName;
    if (assistantCoachName !== undefined) {
      team.assistantCoachName = assistantCoachName;
    }
    if (captain !== undefined) team.captain = captain || undefined;
    if (viceCaptain !== undefined) team.viceCaptain = viceCaptain || undefined;
    if (summary !== undefined) team.summary = summary;
    if (achievements !== undefined) team.achievements = achievements;
    if (isActive !== undefined) team.isActive = isActive;

    await team.save();

    const populatedTeam = await Team.findById(team._id)
      .populate("sport", "name slug category")
      .populate("captain", "fullName")
      .populate("viceCaptain", "fullName");

    res.status(200).json({
      success: true,
      message: "Team updated successfully.",
      team: populatedTeam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update team.",
      error: error.message,
    });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found.",
      });
    }

    team.isActive = false;
    await team.save();

    res.status(200).json({
      success: true,
      message: "Team deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete team.",
      error: error.message,
    });
  }
};

module.exports = {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
};