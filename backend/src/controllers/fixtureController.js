const Fixture = require("../models/Fixture");
const Sport = require("../models/Sport");
const Team = require("../models/Team");

const getFixtures = async (req, res) => {
  try {
    const { sport, team, status, matchType, featuredOnly } = req.query;

    const query = {};

    if (sport && sport !== "ALL") {
      query.sport = sport;
    }

    if (team && team !== "ALL") {
      query.team = team;
    }

    if (status && status !== "ALL") {
      query.status = status;
    }

    if (matchType && matchType !== "ALL") {
      query.matchType = matchType;
    }

    if (featuredOnly === "true") {
      query.isFeatured = true;
    }

    const fixtures = await Fixture.find(query)
      .populate("sport", "name slug category")
      .populate("team", "name ageGroup year")
      .sort({ matchDate: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: fixtures.length,
      fixtures,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch fixtures.",
      error: error.message,
    });
  }
};

const getFixtureById = async (req, res) => {
  try {
    const fixture = await Fixture.findById(req.params.id)
      .populate("sport", "name slug category")
      .populate("team", "name ageGroup year");

    if (!fixture) {
      return res.status(404).json({
        success: false,
        message: "Fixture not found.",
      });
    }

    res.status(200).json({
      success: true,
      fixture,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch fixture.",
      error: error.message,
    });
  }
};

const createFixture = async (req, res) => {
  try {
    const {
      sport,
      team,
      title,
      opponent,
      venue,
      matchDate,
      matchType,
      status,
      result,
      isFeatured,
    } = req.body;

    if (!sport || !title || !opponent || !matchDate) {
      return res.status(400).json({
        success: false,
        message: "Sport, title, opponent, and match date are required.",
      });
    }

    const selectedSport = await Sport.findOne({
      _id: sport,
      isActive: true,
    });

    if (!selectedSport) {
      return res.status(404).json({
        success: false,
        message: "Selected sport not found.",
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
    }

    const fixture = await Fixture.create({
      sport,
      team: team || undefined,
      title,
      opponent,
      venue,
      matchDate,
      matchType,
      status,
      result,
      isFeatured,
    });

    const populatedFixture = await Fixture.findById(fixture._id)
      .populate("sport", "name slug category")
      .populate("team", "name ageGroup year");

    res.status(201).json({
      success: true,
      message: "Fixture created successfully.",
      fixture: populatedFixture,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create fixture.",
      error: error.message,
    });
  }
};

const updateFixture = async (req, res) => {
  try {
    const {
      sport,
      team,
      title,
      opponent,
      venue,
      matchDate,
      matchType,
      status,
      result,
      isFeatured,
    } = req.body;

    const fixture = await Fixture.findById(req.params.id);

    if (!fixture) {
      return res.status(404).json({
        success: false,
        message: "Fixture not found.",
      });
    }

    if (sport) {
      const selectedSport = await Sport.findOne({
        _id: sport,
        isActive: true,
      });

      if (!selectedSport) {
        return res.status(404).json({
          success: false,
          message: "Selected sport not found.",
        });
      }

      fixture.sport = sport;
    }

    if (team !== undefined) {
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

        fixture.team = team;
      } else {
        fixture.team = undefined;
      }
    }

    if (title !== undefined) fixture.title = title;
    if (opponent !== undefined) fixture.opponent = opponent;
    if (venue !== undefined) fixture.venue = venue;
    if (matchDate !== undefined) fixture.matchDate = matchDate;
    if (matchType !== undefined) fixture.matchType = matchType;
    if (status !== undefined) fixture.status = status;
    if (result !== undefined) fixture.result = result;
    if (isFeatured !== undefined) fixture.isFeatured = isFeatured;

    await fixture.save();

    const populatedFixture = await Fixture.findById(fixture._id)
      .populate("sport", "name slug category")
      .populate("team", "name ageGroup year");

    res.status(200).json({
      success: true,
      message: "Fixture updated successfully.",
      fixture: populatedFixture,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update fixture.",
      error: error.message,
    });
  }
};

const deleteFixture = async (req, res) => {
  try {
    const fixture = await Fixture.findById(req.params.id);

    if (!fixture) {
      return res.status(404).json({
        success: false,
        message: "Fixture not found.",
      });
    }

    await fixture.deleteOne();

    res.status(200).json({
      success: true,
      message: "Fixture deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete fixture.",
      error: error.message,
    });
  }
};

module.exports = {
  getFixtures,
  getFixtureById,
  createFixture,
  updateFixture,
  deleteFixture,
};