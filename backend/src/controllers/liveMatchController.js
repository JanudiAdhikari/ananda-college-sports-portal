const LiveMatch = require("../models/LiveMatch");
const Sport = require("../models/Sport");

const getLiveMatches = async (req, res) => {
  try {
    const { status, sport, visibleOnly } = req.query;

    const query = {};

    if (visibleOnly === "true") {
      query.isVisible = true;
    }

    if (status && status !== "ALL") {
      query.status = status;
    }

    if (sport && sport !== "ALL") {
      query.sport = sport;
    }

    const liveMatches = await LiveMatch.find(query)
      .populate("sport", "name slug category")
      .populate("updatedBy", "fullName role")
      .sort({ matchDate: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: liveMatches.length,
      liveMatches,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch live matches.",
      error: error.message,
    });
  }
};

const getLiveMatchById = async (req, res) => {
  try {
    const liveMatch = await LiveMatch.findById(req.params.id)
      .populate("sport", "name slug category")
      .populate("updatedBy", "fullName role");

    if (!liveMatch) {
      return res.status(404).json({
        success: false,
        message: "Live match not found.",
      });
    }

    res.status(200).json({
      success: true,
      liveMatch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch live match.",
      error: error.message,
    });
  }
};

const createLiveMatch = async (req, res) => {
  try {
    const {
      sport,
      title,
      anandaTeamName,
      opponentTeamName,
      venue,
      matchDate,
      videoUrl,
      status,
      score,
      isVisible,
    } = req.body;

    if (!sport || !title || !opponentTeamName || !matchDate) {
      return res.status(400).json({
        success: false,
        message: "Sport, title, opponent team name, and match date are required.",
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

    const liveMatch = await LiveMatch.create({
      sport,
      title,
      anandaTeamName,
      opponentTeamName,
      venue,
      matchDate,
      videoUrl,
      status,
      score,
      isVisible,
      updatedBy: req.user._id,
    });

    const populatedLiveMatch = await LiveMatch.findById(liveMatch._id)
      .populate("sport", "name slug category")
      .populate("updatedBy", "fullName role");

    res.status(201).json({
      success: true,
      message: "Live match created successfully.",
      liveMatch: populatedLiveMatch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create live match.",
      error: error.message,
    });
  }
};

const updateLiveMatch = async (req, res) => {
  try {
    const {
      sport,
      title,
      anandaTeamName,
      opponentTeamName,
      venue,
      matchDate,
      videoUrl,
      status,
      score,
      isVisible,
    } = req.body;

    const liveMatch = await LiveMatch.findById(req.params.id);

    if (!liveMatch) {
      return res.status(404).json({
        success: false,
        message: "Live match not found.",
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

      liveMatch.sport = sport;
    }

    if (title !== undefined) liveMatch.title = title;
    if (anandaTeamName !== undefined) liveMatch.anandaTeamName = anandaTeamName;
    if (opponentTeamName !== undefined) liveMatch.opponentTeamName = opponentTeamName;
    if (venue !== undefined) liveMatch.venue = venue;
    if (matchDate !== undefined) liveMatch.matchDate = matchDate;
    if (videoUrl !== undefined) liveMatch.videoUrl = videoUrl;
    if (status !== undefined) liveMatch.status = status;
    if (score !== undefined) liveMatch.score = score;
    if (isVisible !== undefined) liveMatch.isVisible = isVisible;

    liveMatch.updatedBy = req.user._id;

    await liveMatch.save();

    const populatedLiveMatch = await LiveMatch.findById(liveMatch._id)
      .populate("sport", "name slug category")
      .populate("updatedBy", "fullName role");

    res.status(200).json({
      success: true,
      message: "Live match updated successfully.",
      liveMatch: populatedLiveMatch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update live match.",
      error: error.message,
    });
  }
};

const updateLiveScore = async (req, res) => {
  try {
    const {
      anandaScore,
      opponentScore,
      currentStatus,
      overs,
      wickets,
      updateText,
    } = req.body;

    const liveMatch = await LiveMatch.findById(req.params.id);

    if (!liveMatch) {
      return res.status(404).json({
        success: false,
        message: "Live match not found.",
      });
    }

    liveMatch.score = {
      anandaScore: anandaScore ?? liveMatch.score.anandaScore,
      opponentScore: opponentScore ?? liveMatch.score.opponentScore,
      currentStatus: currentStatus ?? liveMatch.score.currentStatus,
      overs: overs ?? liveMatch.score.overs,
      wickets: wickets ?? liveMatch.score.wickets,
    };

    if (updateText) {
      liveMatch.updates.unshift({
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        text: updateText,
      });
    }

    liveMatch.updatedBy = req.user._id;

    await liveMatch.save();

    const populatedLiveMatch = await LiveMatch.findById(liveMatch._id)
      .populate("sport", "name slug category")
      .populate("updatedBy", "fullName role");

    res.status(200).json({
      success: true,
      message: "Live score updated successfully.",
      liveMatch: populatedLiveMatch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update live score.",
      error: error.message,
    });
  }
};

const deleteLiveMatch = async (req, res) => {
  try {
    const liveMatch = await LiveMatch.findById(req.params.id);

    if (!liveMatch) {
      return res.status(404).json({
        success: false,
        message: "Live match not found.",
      });
    }

    liveMatch.isVisible = false;
    liveMatch.status = "CANCELLED";
    liveMatch.updatedBy = req.user._id;

    await liveMatch.save();

    res.status(200).json({
      success: true,
      message: "Live match removed successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove live match.",
      error: error.message,
    });
  }
};

module.exports = {
  getLiveMatches,
  getLiveMatchById,
  createLiveMatch,
  updateLiveMatch,
  updateLiveScore,
  deleteLiveMatch,
};